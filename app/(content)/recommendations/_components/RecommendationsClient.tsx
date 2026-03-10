"use client";

import { Text } from "@/components/Text";
import { FilmsInfiniteList } from "@/components/FilmsInfiniteList";
import type { FilmType } from "@/store/models/Film";
import type { PaginationType } from "@/store/models/Pagination";

import styles from "../RecommendationsPage.module.scss";

type Props = {
    initialFilms: FilmType[];
    initialPagination: PaginationType;
};

export const RecommendationsClient = ({ initialFilms, initialPagination }: Props) => {
    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Рекомендации
            </Text>
            <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                Подборка избранных фильмов, которые стоит посмотреть.
            </Text>
            <div className={styles.films_title}>
                <Text view="subtitle" weight="bold">
                    Все рекомендации
                </Text>
                <Text view="p-20" color="accent">
                    {initialPagination.total}
                </Text>
            </div>

            <FilmsInfiniteList
                initialFilms={initialFilms}
                initialPagination={initialPagination}
                filters={{ isFeatured: true }}
            />
        </>
    );
};
