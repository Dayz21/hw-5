"use client";

import { useState, useRef, useMemo, useCallback } from "react";
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

const FavoriteButton = observer(({ filmId }: { filmId: number }) => {
    const isFav = rootStore.favoritesStore.contains(filmId);
    return (
        <Button onClick={() => rootStore.favoritesStore.toggleFavorite(filmId)} outlined={!isFav}>
            {isFav ? "В избранном" : "В избранное"}
        </Button>
    );
});

export const FilmsInfiniteList = observer(({ initialFilms, initialPagination, filters }: Props) => {
    const router = useRouter();
    const [extraFilms, setExtraFilms] = useState<FilmType[]>([]);
    const [pagination, setPagination] = useState(initialPagination);
    const isLoadingRef = useRef(false);
    const isAuthorized = rootStore.userStore.isAuthorized;

    const loadMore = async () => {
        if (pagination.page >= pagination.pageCount) return;
        if (isLoadingRef.current) return;
        isLoadingRef.current = true;
        try {
            const { films, pagination: next } = await FilmsAPI.fetchFilms({
                page: pagination.page + 1,
                pageSize: pagination.pageSize,
                filters,
            });
            setExtraFilms((prev) => [...prev, ...films]);
            setPagination(next);
        } catch {
            rootStore.toastStore.show("Не удалось загрузить фильмы", "error");
        } finally {
            isLoadingRef.current = false;
        }
    };

    const trigger = useInfinityScroll({ callback: loadMore });
    const allFilms = useMemo(() => [...initialFilms, ...extraFilms], [initialFilms, extraFilms]);
    const handleFilmClick = useCallback(
        (filmId: string) => {
            router.push(ROUTES.film.get(filmId));
        },
        [router],
    );

    return (
        <>
            <div className={styles.films}>
                {allFilms.map((film) => (
                    <Card
                        key={film.documentId}
                        film={film}
                        onClick={() => handleFilmClick(film.documentId)}
                    >
                        {isAuthorized && <FavoriteButton filmId={film.id} />}
                        <Button onClick={() => handleFilmClick(film.documentId)}>Смотреть</Button>
                    </Card>
                ))}
            </div>

            {pagination.page < pagination.pageCount && trigger}
        </>
    );
});
