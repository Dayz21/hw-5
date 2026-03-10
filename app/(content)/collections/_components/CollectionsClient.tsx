"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useLocalStore } from "@/hooks/useLocalStore";
import { CollectionsStore } from "@/store/CollectionsStore";
import type { CategoryType } from "@/store/models/Category";
import { CategorySection } from "./CategorySection";

import styles from "../CollectionsPage.module.scss";
import { Text } from "@/components/Text";

type Props = {
    categories: CategoryType[];
};

export const CollectionsClient = observer(({ categories }: Props) => {
    const store = useLocalStore(() => new CollectionsStore(categories));

    useEffect(() => {
        store.initWithCategories(categories);
    }, [store, categories]);

    return (
        <div className={styles.page}>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Подборки
            </Text>
            <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                Выберите жанр — откроется подборка фильмов по категории.
            </Text>

            <div className={styles.list}>
                {store.categories.map((category) => (
                    <CategorySection
                        key={category.documentId}
                        category={category}
                        films={store.getFilms(category.documentId)}
                        loading={store.getCategoryLoading(category.documentId)}
                    />
                ))}
            </div>
        </div>
    );
});
