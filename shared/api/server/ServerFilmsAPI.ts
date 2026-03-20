import qs from "qs";
import { notFound } from "next/navigation";

import { buildFilmsQuery } from "@/shared/api/filmsQueryUtils";
import type { FetchFilmsResponse, FilmFiltersType } from "@/shared/api/types/Film";
import { toFilmType, type FilmType } from "@/shared/store/models/Film";
import { toPaginationType } from "@/shared/store/models/Pagination";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function serverFetchFilms({
    page,
    pageSize,
    filters,
    fetchOptions,
}: {
    page: number;
    pageSize: number;
    filters?: FilmFiltersType;
    fetchOptions?: RequestInit;
}): Promise<FetchFilmsResponse> {
    const query = buildFilmsQuery(page, pageSize, filters);
    const res = await fetch(`${API_URL}/films?${query}`, {
        next: { revalidate: 60 },
        ...fetchOptions,
    });

    if (!res.ok) throw new Error(`Failed to fetch films: ${res.statusText}`);

    const data = await res.json();

    return {
        films: data.data.map(toFilmType),
        pagination: toPaginationType(data.meta.pagination),
    };
}

export async function serverFetchFilmById(
    id: string,
    fetchOptions?: RequestInit,
): Promise<FilmType> {
    const query = qs.stringify({
        populate: ["category", "poster", "gallery"],
    });
    const res = await fetch(`${API_URL}/films/${id}?${query}`, {
        next: { revalidate: 60, tags: [`film-${id}`] },
        ...fetchOptions,
    });

    if (res.status === 404) notFound();
    if (!res.ok) throw new Error(`Failed to fetch film ${id}: ${res.statusText}`);

    const data = await res.json();

    return toFilmType(data.data);
}
