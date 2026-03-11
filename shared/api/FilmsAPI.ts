import qs from "qs";

import { buildFilmsQuery } from "./filmsQueryUtils";
import type { FetchFilmsFunc } from "./types/Film";
import { toFilmType, type FilmType } from "@/shared/store/models/Film";
import { toPaginationType } from "@/shared/store/models/Pagination";
import { API } from "./API";

class FilmsAPIClass {
    fetchFilms: FetchFilmsFunc = async ({ page, pageSize, filters }) => {
        const query = buildFilmsQuery(page, pageSize, filters);
        const response = await API.get(`/films?${query}`);

        return {
            films: response.data.data.map(toFilmType),
            pagination: toPaginationType(response.data.meta.pagination),
        };
    };

    async fetchFilmById(id: string): Promise<FilmType> {
        const query = qs.stringify({
            populate: ["category", "poster", "gallery"],
        });

        const response = await API.get(`/films/${id}?${query}`);
        return toFilmType(response.data.data);
    }
}

export const FilmsAPI = new FilmsAPIClass();
