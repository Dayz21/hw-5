import type { Option } from "@/shared/components/MultiDropdown/MultiDropdown";
import type { FilmType } from "@/shared/store/models/Film";
import type { PaginationType } from "@/shared/store/models/Pagination";

export type FetchFilmsParams = {
    page: number;
    pageSize: number;
    filters?: FilmFiltersType;
};

export type FetchFilmsFunc = (params: FetchFilmsParams) => Promise<FetchFilmsResponse>;

export type FilmFiltersType = {
    categories?: Option[];
    search?: string;
    isFeatured?: boolean;

    releaseYearFrom?: number | null;
    releaseYearTo?: number | null;
    ratingFrom?: number | null;
    ratingTo?: number | null;
    durationFrom?: number | null;
    durationTo?: number | null;

    ageLimits?: Option[];

    sort?: string[];
};

export type FetchFilmsResponse = {
    films: FilmType[];
    pagination: PaginationType;
};

export type FilmFiltersConditions = {
    title?: { $containsi: string };
    category?: { documentId: { $in: string[] } };
    isFeatured?: { $eq: boolean };

    releaseYear?: { $gte?: number; $lte?: number };
    rating?: { $gte?: number; $lte?: number };
    duration?: { $gte?: number; $lte?: number };
    ageLimit?: { $in: number[] };
};

export type FilmsQueryParams = {
    pagination: { page: number; pageSize: number };
    populate: string[];
    filters?: FilmFiltersConditions;
    sort?: string[];
};

export type FilmsSortField = "rating" | "releaseYear";
export type FilmsSortOrder = "asc" | "desc";
