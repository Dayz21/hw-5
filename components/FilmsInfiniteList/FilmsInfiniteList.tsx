"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useInfinityScroll } from "@/hooks/useInfinityScroll";
import { FilmsAPI } from "@/api/FilmsAPI";
import { rootStore } from "@/store/rootStore";
import { ROUTES } from "@/config/routes";
import type { FilmType } from "@/store/models/Film";
import type { PaginationType } from "@/store/models/Pagination";
import type { FilmFiltersType } from "@/api/types/Film";

import styles from "./FilmsInfiniteList.module.scss";

type Props = {
    initialFilms: FilmType[];
    initialPagination: PaginationType;
    filters: FilmFiltersType;
};

export const FilmsInfiniteList = observer(({ initialFilms, initialPagination, filters }: Props) => {
    const router = useRouter();
    const [extraFilms, setExtraFilms] = useState<FilmType[]>([]);
    const [pagination, setPagination] = useState(initialPagination);
    const isAuthorized = rootStore.userStore.isAuthorized;

    const loadMore = async () => {
        if (pagination.page >= pagination.pageCount) return;
        try {
            const { films, pagination: next } = await FilmsAPI.fetchFilms({
                page: pagination.page + 1,
                pageSize: pagination.pageSize,
                filters,
            });
            setExtraFilms((prev) => [...prev, ...films]);
            setPagination(next);
        } catch (e) {
            console.error("Failed to load more films:", e);
        }
    };

    const trigger = useInfinityScroll({ callback: loadMore });
    const allFilms = [...initialFilms, ...extraFilms];

    return (
        <>
            <div className={styles.films}>
                {allFilms.map((film) => (
                    <Card key={film.documentId} film={film}>
                        {isAuthorized && (
                            <Button
                                onClick={() => rootStore.favoritesStore.toggleFavorite(film.id)}
                                outlined
                            >
                                {rootStore.favoritesStore.contains(film.id)
                                    ? "В избранном"
                                    : "В избранное"}
                            </Button>
                        )}
                        <Button onClick={() => router.push(ROUTES.film.get(film.documentId))}>
                            Смотреть
                        </Button>
                    </Card>
                ))}
            </div>

            {pagination.page < pagination.pageCount && trigger}
        </>
    );
});
