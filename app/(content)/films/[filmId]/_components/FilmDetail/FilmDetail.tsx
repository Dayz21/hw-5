"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { StarIcon } from "@/components/Icons/StarIcon/StarIcon";
import { Text } from "@/components/Text";
import { getFormattedTime } from "@/utils/getFormattedTime";
import { VideoFrame } from "@/components/VideoFrame";
import { FilmsCarousel } from "@/components/FilmsCarousel";
import { Button } from "@/components/Button";
import { rootStore } from "@/store/rootStore";
import { ROUTES } from "@/config/routes";
import type { FilmType } from "@/store/models/Film";
import { BackButton } from "../BackButton/BackButton";
import { ImagesSlider } from "../ImagesSlider/ImagesSlider";

import styles from "./FilmDetail.module.scss";

type Props = {
    film: FilmType;
    recommendations: FilmType[];
};

const FilmActions = observer(({ filmId }: { filmId: number }) => {
    if (!rootStore.userStore.isAuthorized) return null;
    return (
        <div className={styles.actions}>
            <Button onClick={() => rootStore.favoritesStore.toggleFavorite(filmId)} outlined>
                {rootStore.favoritesStore.contains(filmId) ? "В избранном" : "В избранное"}
            </Button>
        </div>
    );
});

export function FilmDetail({ film, recommendations }: Props) {
    const router = useRouter();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [film.documentId]);

    return (
        <>
            <BackButton
                className={styles.back_button}
                onClick={() => router.push(ROUTES.films.get())}
            />

            <div className={styles.film}>
                <VideoFrame src={film.trailerUrl} title={film.title} />

                <div className={styles.info}>
                    <div className={styles.info_header}>
                        <Text view="subtitle" weight="bold" tag="h1">
                            {film.title}
                        </Text>
                        <div className={styles.rating}>
                            <Text view="p-24" weight="medium">
                                {film.rating}
                            </Text>
                            <StarIcon color="original" size={24} />
                        </div>
                    </div>

                    <FilmActions filmId={film.id} />

                    <div className={styles.brief}>
                        <Text view="p-20" weight="medium">
                            {film.releaseYear}
                        </Text>
                        <Text view="p-20" weight="medium">
                            •
                        </Text>
                        <Text view="p-20" weight="medium">
                            {film.category.title}
                        </Text>
                        <Text view="p-20" weight="medium">
                            •
                        </Text>
                        <Text view="p-20" weight="medium">
                            {film.ageLimit}+
                        </Text>
                        <Text view="p-20" weight="medium">
                            •
                        </Text>
                        <Text view="p-20" weight="medium">
                            {getFormattedTime(film.duration)}
                        </Text>
                    </div>

                    <Text view="p-20" color="secondary">
                        {film.description}
                    </Text>
                </div>
            </div>

            <div className={styles.images_slider_container}>
                <Text view="subtitle" weight="bold" className={styles.recomendations_title}>
                    Галерея
                </Text>
                <ImagesSlider images={film.gallery.map((image) => image.url)} />
            </div>

            <div className={styles.recomendations_container}>
                <Text view="subtitle" weight="bold" className={styles.recomendations_title}>
                    Рекомендации
                </Text>
                <FilmsCarousel
                    films={recommendations}
                    onFilmClick={(rec) => {
                        if (rec.documentId === film.documentId) return;
                        router.push(ROUTES.film.get(rec.documentId));
                    }}
                />
            </div>
        </>
    );
}
