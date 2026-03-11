"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useInfinityScroll } from "@/shared/hooks/useInfinityScroll";
import { FilmsAPI } from "@/shared/api/FilmsAPI";
import { rootStore } from "@/shared/store/rootStore";
import { ROUTES } from "@/shared/config/routes";
import type { FilmType } from "@/shared/store/models/Film";
import type { PaginationType } from "@/shared/store/models/Pagination";
import type { FilmFiltersType } from "@/shared/api/types/Film";

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
