import { Text } from "@/components/Text";
import { FavoritesSkeleton } from "./_components/FavoritesSkeleton";

import styles from "./FavoritesPage.module.scss";

export default function Loading() {
    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Избранное
            </Text>
            <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                Здесь собраны фильмы, которые вы добавили в избранное.
            </Text>
            <FavoritesSkeleton />
        </>
    );
}
