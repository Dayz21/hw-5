import { CardSkeleton } from "@/shared/components/Card";
import { COUNT_OF_FILMS_ON_PAGE } from "@/shared/config/config";
import { Text } from "@/shared/components/Text";

import pageStyles from "../FilmsPage.module.scss";
import listStyles from "@components/FilmsInfiniteList/FilmsInfiniteList.module.scss";

export const FilmsListSkeleton = () => (
    <>
        <div className={pageStyles.films_title}>
            <Text view="subtitle" weight="bold">
                Все фильмы
            </Text>
        </div>
        <div className={listStyles.films_skeleton}>
            {Array.from({ length: COUNT_OF_FILMS_ON_PAGE }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    </>
);
