export type FilmType = {
    id: number | string;
    title: string;
    description: string;
    poster: { url: string };
    category: { title: string };
    releaseYear: number;
    ageLimit: number;
    rating: number;
    duration: number;
};
