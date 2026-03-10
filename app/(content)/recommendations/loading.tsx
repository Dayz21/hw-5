import { Text } from "@/components/Text";
import { RecommendationsSkeleton } from "./_components/RecommendationsSkeleton";

import styles from "./RecommendationsPage.module.scss";

export default function Loading() {
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
            </div>
            <RecommendationsSkeleton />
        </>
    );
}
