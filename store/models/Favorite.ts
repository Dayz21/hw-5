import { toFilmType, type FilmResponseType, type FilmType } from "./Film";

export type FavoriteResponseType = {
    id: number;
    documentId: string;
    originalFilmId: number;
    film: FilmResponseType;
};

export type FavoriteType = {
    id: number;
    documentId: string;
    originalFilmId: number;
    film: FilmType;
};

export const toFavoriteType = (response: FavoriteResponseType): FavoriteType => ({
    id: response.id,
    documentId: response.documentId,
    originalFilmId: response.originalFilmId,
    film: toFilmType(response.film),
});
