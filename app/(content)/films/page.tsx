import { Text } from "@/shared/components/Text";
import { serverFetchFilms } from "@/shared/api/server/ServerFilmsAPI";
import { serverFetchCategories } from "@/shared/api/server/ServerCategoriesAPI";
import { toOptionType } from "@/shared/store/models/Category";
import { parseNumberParam } from "@/shared/utils/numberInput";
import { COUNT_OF_FILMS_ON_PAGE, AGE_LIMIT_OPTIONS } from "@/shared/config/config";
import type { FilmFiltersType } from "@/shared/api/types/Film";
import type { Option } from "@/shared/components/MultiDropdown/MultiDropdown";
import type { FilmsSortField, FilmsSortOrder } from "@/shared/store/FilmsStore";
import { FiltersBar } from "./_components/FiltersBar";
import { FilmsInfiniteList } from "@/shared/components/FilmsInfiniteList";

import type { Metadata } from "next";
import styles from "./FilmsPage.module.scss";

export const metadata: Metadata = {
    title: "Все фильмы",
    description: "Полный каталог фильмов и сериалов с фильтрацией по жанру, рейтингу и году.",
};

type SearchParams = { [key: string]: string | string[] | undefined };

function getString(val: string | string[] | undefined): string {
    return typeof val === "string" ? val : "";
}

export default async function FilmsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;

    const searchQuery = getString(params.search);
    const rawCategoryKeys = getString(params.categories).split(",").filter(Boolean);
    const rawAgeLimitKeys = getString(params.ageLimits).split(",").filter(Boolean);
    const yearFrom = parseNumberParam(getString(params.yearFrom) || null);
    const yearTo = parseNumberParam(getString(params.yearTo) || null);
    const ratingFrom = parseNumberParam(getString(params.ratingFrom) || null);
    const ratingTo = parseNumberParam(getString(params.ratingTo) || null);
    const durationFrom = parseNumberParam(getString(params.durationFrom) || null);
    const durationTo = parseNumberParam(getString(params.durationTo) || null);

    const sortQuery = getString(params.sort);
    const [rawField, rawOrder] = sortQuery.split(":");
    const sortField: FilmsSortField | null =
        rawField === "rating" || rawField === "releaseYear" ? rawField : null;
    const sortOrder: FilmsSortOrder | null =
        rawOrder === "asc" || rawOrder === "desc" ? rawOrder : null;

    const ageLimitByKey = new Map(AGE_LIMIT_OPTIONS.map((o) => [o.key, o]));
    const selectedAgeLimits = rawAgeLimitKeys
        .map((key) => ageLimitByKey.get(key))
        .filter((v): v is Option => v !== undefined);

    const categories = await serverFetchCategories();
    const categoryOptions = categories.map(toOptionType);
    const categoryByKey = new Map(categoryOptions.map((o) => [o.key, o]));
    const selectedCategories = rawCategoryKeys
        .map((key) => categoryByKey.get(key))
        .filter((v): v is Option => v !== undefined);

    const filters: FilmFiltersType = {
        search: searchQuery || undefined,
        categories: selectedCategories.length
            ? selectedCategories.map(({ key }) => ({ key, value: "" }))
            : undefined,
        ageLimits: selectedAgeLimits.length
            ? selectedAgeLimits.map(({ key }) => ({ key, value: "" }))
            : undefined,
        releaseYearFrom: yearFrom,
        releaseYearTo: yearTo,
        ratingFrom,
        ratingTo,
        durationFrom,
        durationTo,
        sort: sortField && sortOrder ? [`${sortField}:${sortOrder}`] : undefined,
    };

    const { films, pagination } = await serverFetchFilms({
        page: 1,
        pageSize: COUNT_OF_FILMS_ON_PAGE,
        filters,
    });

    const listKey = new URLSearchParams(
        Object.fromEntries(
            Object.entries(params).filter(([, v]) => typeof v === "string"),
        ) as Record<string, string>,
    ).toString();

    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Cinema
            </Text>
            <Text view="p-20" tag="h2" color="secondary" className={styles.subtitle}>
                Подборка для вечера уже здесь: фильмы, сериалы и рекомендации. <br />
                Найди что посмотреть — за пару секунд.
            </Text>

            <FiltersBar
                categoryOptions={categoryOptions}
                initialFilters={{
                    search: searchQuery,
                    categories: selectedCategories,
                    ageLimits: selectedAgeLimits,
                    sortField,
                    sortOrder,
                    yearFrom,
                    yearTo,
                    ratingFrom,
                    ratingTo,
                    durationFrom,
                    durationTo,
                }}
            />

            <div className={styles.films_title}>
                <Text view="subtitle" weight="bold">
                    Все фильмы
                </Text>
                <Text view="p-20" color="accent">
                    {pagination.total}
                </Text>
            </div>

            <FilmsInfiniteList
                key={listKey}
                initialFilms={films}
                initialPagination={pagination}
                filters={filters}
            />
        </>
    );
}
