import qs from "qs";

import type { FilmFiltersConditions, FilmFiltersType, FilmsQueryParams } from "./types/Film";

function buildRangeFilter<T>(from: T | null | undefined, to: T | null | undefined) {
    if (from == null && to == null) return undefined;
    return {
        ...(from != null ? { $gte: from } : {}),
        ...(to != null ? { $lte: to } : {}),
    };
}

export function buildFilmsQuery(page: number, pageSize: number, filters?: FilmFiltersType): string {
    const queryParams: FilmsQueryParams = {
        pagination: { page, pageSize },
        populate: ["category", "poster"],
    };

    if (filters) {
        const filterConditions: FilmFiltersConditions = {};

        if (filters.search) {
            filterConditions.title = { $containsi: filters.search };
        }

        if (filters.categories && filters.categories.length > 0) {
            filterConditions.category = {
                documentId: { $in: filters.categories.map((c) => c.key) },
            };
        }

        if (filters.isFeatured !== undefined) {
            filterConditions.isFeatured = { $eq: filters.isFeatured };
        }

        const releaseYear = buildRangeFilter(filters.releaseYearFrom, filters.releaseYearTo);
        if (releaseYear) filterConditions.releaseYear = releaseYear;

        const rating = buildRangeFilter(filters.ratingFrom, filters.ratingTo);
        if (rating) filterConditions.rating = rating;

        const duration = buildRangeFilter(filters.durationFrom, filters.durationTo);
        if (duration) filterConditions.duration = duration;

        if (filters.ageLimits && filters.ageLimits.length > 0) {
            const ageLimits = filters.ageLimits
                .map((a) => Number(a.key))
                .filter((n) => Number.isFinite(n));

            if (ageLimits.length > 0) {
                filterConditions.ageLimit = { $in: ageLimits };
            }
        }

        if (Object.keys(filterConditions).length > 0) {
            queryParams.filters = filterConditions;
        }

        if (filters.sort && filters.sort.length > 0) {
            queryParams.sort = [...filters.sort, "id:asc"];
        }
    }

    return qs.stringify(queryParams, { skipNulls: true });
}
