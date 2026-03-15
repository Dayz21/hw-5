import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { serverFetchFilms } from "@/shared/api/server/ServerFilmsAPI";
import { serverFetchCategories } from "@/shared/api/server/ServerCategoriesAPI";
import { logger } from "@/shared/utils/logger";
import { SYSTEM_PROMPT } from "./system_prompt";
import type { FilmFiltersType } from "@/shared/api/types/Film";
import type { Option } from "@/shared/components/MultiDropdown/MultiDropdown";
import { AGE_LIMIT_OPTIONS, COUNT_OF_FILMS_ON_PAGE } from "@config/config";

const client = new Anthropic({
    baseURL: "https://litellm.tokengate.ru",
    apiKey: process.env.ANTHROPIC_API_KEY!,
});

type AIFilters = {
    search?: string;
    yearFrom?: number;
    yearTo?: number;
    ratingFrom?: number;
    ratingTo?: number;
    categoryNames?: string[];
    ageLimits?: number[];
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const query: string = body?.query ?? "";

        if (!query.trim()) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        const categories = await serverFetchCategories();
        if (!categories || categories.length === 0) {
            return NextResponse.json(
                { error: "No categories available for matching" },
                { status: 500 },
            );
        }

        const model = "claude-sonnet-4-6";
        const modelRequestStartedAt = Date.now();
        logger.debug("Calling AI model for search", {
            model,
            queryLength: query.length,
            categoriesCount: categories.length,
        });

        let message: Awaited<ReturnType<typeof client.messages.create>>;
        try {
            message = await client.messages.create({
                model,
                max_tokens: 512,
                system:
                    SYSTEM_PROMPT +
                    "\nCategories available: " +
                    categories.map((cat) => cat.title).join(", "),
                messages: [{ role: "user", content: query }],
            });
            logger.info("AI model responded for search", {
                model,
                durationMs: Date.now() - modelRequestStartedAt,
            });
        } catch (error) {
            logger.error("AI model request failed", error, {
                model,
                queryLength: query.length,
                categoriesCount: categories.length,
            });
            throw error;
        }

        if (message.content.length === 0) {
            logger.error("AI model returned empty content", undefined, { model });
            throw new Error("Empty Claude response content");
        }

        const content = message.content[0];
        if (content.type !== "text") {
            logger.error("Unexpected AI response type", undefined, {
                model,
                contentType: content.type,
            });
            throw new Error("Unexpected Claude response type");
        }

        let aiFilters: AIFilters = {};
        try {
            aiFilters = JSON.parse(content.text);
        } catch {
            logger.warn("AI returned non-JSON filters, falling back to plain search");
            aiFilters = { search: query };
        }

        const matchedCategories =
            aiFilters.categoryNames && aiFilters.categoryNames.length > 0
                ? categories
                      .filter((cat) =>
                          aiFilters.categoryNames!.some(
                              (name) =>
                                  cat.title.toLowerCase().includes(name.toLowerCase()) ||
                                  name.toLowerCase().includes(cat.title.toLowerCase()),
                          ),
                      )
                      .map((cat) => ({ key: cat.documentId, value: cat.title }))
                : undefined;

        let ageLimitOptions: Option[] | undefined;
        if (aiFilters.ageLimits && aiFilters.ageLimits.length > 0) {
            ageLimitOptions = aiFilters.ageLimits
                .map((age) => AGE_LIMIT_OPTIONS.find((opt) => opt.key === age.toString()))
                .filter((opt): opt is Option => opt !== undefined);
            if (ageLimitOptions.length === 0) {
                ageLimitOptions = undefined;
            }
        }

        const filters: FilmFiltersType = {
            search: aiFilters.search || undefined,
            categories: matchedCategories?.length ? matchedCategories : undefined,
            releaseYearFrom: aiFilters.yearFrom ?? null,
            releaseYearTo: aiFilters.yearTo ?? null,
            ratingFrom: aiFilters.ratingFrom ?? null,
            ratingTo: aiFilters.ratingTo ?? null,
            ageLimits: ageLimitOptions,
        };

        const { films, pagination } = await serverFetchFilms({
            page: 1,
            pageSize: COUNT_OF_FILMS_ON_PAGE,
            filters,
        });

        return NextResponse.json({ films, pagination, filters });
    } catch (error) {
        logger.error("AI search route failed", error);
        let errorMessage = "AI search failed.";
        if (error && typeof error === "object" && "message" in error) {
            errorMessage += ` Reason: ${(error as { message?: string }).message}`;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
