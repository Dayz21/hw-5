import { Text } from "@/components/Text";
import { CollectionsSkeleton } from "./_components/CollectionsSkeleton";

import styles from "./CollectionsPage.module.scss";

export default function Loading() {
    return (
        <div className={styles.page}>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Подборки
            </Text>
            <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                Выберите жанр — откроется подборка фильмов по категории.
            </Text>
            <CollectionsSkeleton />
        </div>
    );
}
