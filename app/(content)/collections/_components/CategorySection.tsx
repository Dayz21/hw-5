"use client";

import { useRouter } from "next/navigation";
import { Text } from "@/shared/components/Text";
import { Button } from "@/shared/components/Button";
import { FilmsCarousel } from "@/shared/components/FilmsCarousel";
import { CardSkeleton } from "@/shared/components/Card";
import { ROUTES } from "@/shared/config/routes";
import type { CategoryType } from "@/shared/store/models/Category";
import type { FilmType } from "@/shared/store/models/Film";

import styles from "../CollectionsPage.module.scss";
import skeletonStyles from "./CollectionsSkeleton.module.scss";

const SKELETON_CARDS = 3;

type Props = {
    category: CategoryType;
    films: FilmType[];
    loading: boolean;
};

export const CategorySection = ({ category, films, loading }: Props) => {
    const router = useRouter();

    return (
        <div className={styles.category}>
            <div className={styles.header}>
                <Text view="subtitle" weight="bold">
                    {category.title}
                </Text>
                <Button
                    outlined
                    onClick={() =>
                        router.push(`${ROUTES.films.get()}?categories=${category.documentId}`)
                    }
                >
                    Смотреть все
                </Button>
            </div>

            {loading ? (
                <div className={skeletonStyles.carousel_skeleton}>
                    {Array.from({ length: SKELETON_CARDS }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : films.length === 0 ? (
                <Text view="p-20" color="secondary" className={styles.empty}>
                    В этой категории пока нет фильмов.
                </Text>
            ) : (
                <FilmsCarousel
                    films={films}
                    onFilmClick={(film) => router.push(ROUTES.film.get(film.documentId))}
                />
            )}
        </div>
    );
};
