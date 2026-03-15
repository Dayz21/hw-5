import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { serverFetchFilms } from "@/shared/api/server/ServerFilmsAPI";
import { serverFetchCategories } from "@/shared/api/server/ServerCategoriesAPI";
import { SYSTEM_PROMPT } from "./system_prompt";
import type { FilmFiltersType } from "@/shared/api/types/Film";

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
            return NextResponse.json({ error: "No categories available for matching" }, { status: 500 });
        }

        const message = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 512,
            system: SYSTEM_PROMPT + "\nCategories available: " + categories.map((cat) => cat.title).join(", "),
            messages: [{ role: "user", content: query }],
        });

        const content = message.content[0];
        if (content.type !== "text") throw new Error("Unexpected Claude response type");

        let aiFilters: AIFilters = {};
        try {
            aiFilters = JSON.parse(content.text);
        } catch {
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

        const filters: FilmFiltersType = {
            search: aiFilters.search || undefined,
            categories: matchedCategories?.length ? matchedCategories : undefined,
            releaseYearFrom: aiFilters.yearFrom ?? null,
            releaseYearTo: aiFilters.yearTo ?? null,
            ratingFrom: aiFilters.ratingFrom ?? null,
            ratingTo: aiFilters.ratingTo ?? null,
        };

        const { films, pagination } = await serverFetchFilms({
            page: 1,
            pageSize: 12,
            filters,
        });

        return NextResponse.json({ films, pagination, filters });
    } catch (error) {
        return NextResponse.json({ error: "AI search failed. Check your ANTHROPIC_API_KEY." }, { status: 500 });
    }
}
