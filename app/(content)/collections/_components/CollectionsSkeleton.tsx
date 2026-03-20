import { CardSkeleton } from "@/shared/components/Card";
import styles from "./CollectionsSkeleton.module.scss";
import pageStyles from "../CollectionsPage.module.scss";

const SKELETON_COUNT = 4;
const CARDS_PER_ROW = 3;

export const CollectionsSkeleton = () => (
    <div className={pageStyles.list}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className={styles.category}>
                <div className={styles.header}>
                    <div className={styles.title_skeleton} />
                    <div className={styles.button_skeleton} />
                </div>
                <div className={styles.carousel_skeleton}>
                    {Array.from({ length: CARDS_PER_ROW }).map((_, j) => (
                        <CardSkeleton key={j} />
                    ))}
                </div>
            </div>
        ))}
    </div>
);
