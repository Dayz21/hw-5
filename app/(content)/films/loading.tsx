import { Text } from "@/shared/components/Text";
import { FiltersBarSkeleton } from "./_components/FiltersBar";
import { FilmsListSkeleton } from "./_components/FilmsListSkeleton";

import pageStyles from "./FilmsPage.module.scss";

export default function Loading() {
    return (
        <>
            <Text view="title" tag="h1" className={pageStyles.title} weight="bold">
                Cinema
            </Text>
            <Text view="p-20" tag="h2" color="secondary" className={pageStyles.subtitle}>
                Подборка для вечера уже здесь: фильмы, сериалы и рекомендации. <br />
                Найди что посмотреть — за пару секунд.
            </Text>

            <FiltersBarSkeleton />
            <FilmsListSkeleton />
        </>
    );
}
