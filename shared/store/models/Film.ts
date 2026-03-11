import { toCategoryType, type CategoryReponseType, type CategoryType } from "./Category";
import { toImageType, type ImageResponseType, type ImageType } from "./Image";

export type FilmResponseType = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    shortDescription: string;
    releaseYear: number;
    duration: number;
    rating: number;
    ageLimit: number;
    isFeatured: boolean;
    slug: string;
    trailerUrl: string;
    category: CategoryReponseType;
    poster: ImageResponseType;
    gallery?: ImageResponseType[];
};

export type FilmType = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    shortDescription: string;
    releaseYear: number;
    duration: number;
    rating: number;
    ageLimit: number;
    isFeatured: boolean;
    slug: string;
    trailerUrl: string;
    category: CategoryType;
    poster: ImageType;
    gallery: ImageType[];
};

export const toFilmType = (response: FilmResponseType): FilmType => ({
    id: response.id,
    documentId: response.documentId,
    title: response.title,
    description: response.description,
    shortDescription: response.shortDescription,
    releaseYear: response.releaseYear,
    duration: response.duration,
    rating: response.rating,
    ageLimit: response.ageLimit,
    isFeatured: response.isFeatured,
    slug: response.slug,
    trailerUrl: response.trailerUrl,
    category: toCategoryType(response.category),
    poster: toImageType(response.poster),
    gallery: response.gallery ? response.gallery?.map(toImageType) : [],
});
