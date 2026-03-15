import type { Metadata } from "next";
import { serverFetchFilmById, serverFetchFilms } from "@/shared/api/server/ServerFilmsAPI";
import { COUNT_OF_RECOMMENDATIONS } from "@/shared/config/config";
import { FilmDetail } from "./_components/FilmDetail";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ filmId: string }>;
}): Promise<Metadata> {
    const { filmId } = await params;
    const film = await serverFetchFilmById(filmId);
    return {
        title: film.title,
        description: film.shortDescription,
        openGraph: {
            title: film.title,
            description: film.shortDescription,
            images: [{ url: film.poster.url }],
            type: "video.movie",
        },
    };
}

export default async function FilmPage({ params }: { params: Promise<{ filmId: string }> }) {
    const { filmId } = await params;

    const [film, { films: recommendations }] = await Promise.all([
        serverFetchFilmById(filmId),
        serverFetchFilms({
            page: 1,
            pageSize: COUNT_OF_RECOMMENDATIONS,
            filters: { isFeatured: true },
        }),
    ]);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: film.title,
        description: film.shortDescription,
        dateCreated: String(film.releaseYear),
        contentRating: `${film.ageLimit}+`,
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: film.rating,
            bestRating: 10,
        },
        image: film.poster.url,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <FilmDetail film={film} recommendations={recommendations} />
        </>
    );
}
