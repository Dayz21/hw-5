import type { Metadata } from "next";
import { serverFetchFilms } from "@/shared/api/server/ServerFilmsAPI";
import { COUNT_OF_FILMS_ON_PAGE } from "@/shared/config/config";
import { RecommendationsClient } from "./_components/RecommendationsClient";

export const metadata: Metadata = {
    title: "Рекомендации",
    description: "Подборка избранных фильмов, которые стоит посмотреть.",
};

export default async function RecommendationsPage() {
    const { films, pagination } = await serverFetchFilms({
        page: 1,
        pageSize: COUNT_OF_FILMS_ON_PAGE,
        filters: { isFeatured: true },
    });

    return <RecommendationsClient initialFilms={films} initialPagination={pagination} />;
}
