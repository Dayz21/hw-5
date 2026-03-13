"use client";

import { Text } from "@/shared/components/Text";
import { FilmsInfiniteList } from "@/shared/components/FilmsInfiniteList";
import type { FilmType } from "@/shared/store/models/Film";
import type { PaginationType } from "@/shared/store/models/Pagination";

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

            {initialPagination.total === 0 ? (
                <Text view="p-20" color="secondary">
                    Пока нет рекомендованных фильмов.
                </Text>
            ) : (
                <FilmsInfiniteList
                    initialFilms={initialFilms}
                    initialPagination={initialPagination}
                    filters={{ isFeatured: true }}
                />
            )}
        </>
    );
};
