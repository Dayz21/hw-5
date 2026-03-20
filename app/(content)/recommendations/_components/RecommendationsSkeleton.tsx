import { CardSkeleton } from "@/shared/components/Card";
import { COUNT_OF_FILMS_ON_PAGE } from "@/shared/config/config";

import listStyles from "@components/FilmsInfiniteList/FilmsInfiniteList.module.scss";

export const RecommendationsSkeleton = () => (
    <div className={listStyles.films_skeleton}>
        {Array.from({ length: COUNT_OF_FILMS_ON_PAGE }).map((_, i) => (
            <CardSkeleton key={i} />
        ))}
    </div>
);
