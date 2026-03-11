import styles from "./CardSkeleton.module.scss";

export const CardSkeleton = () => {
    return (
        <div className={styles.card_skeleton}>
            <div className={styles.image_skeleton} />
            <div className={styles.info_skeleton}>
                <div className={styles.brief_skeleton} />

                <div className={styles.title_skeleton} />

                <div className={styles.description_skeleton} />
                <div className={styles.description_skeleton} />
                <div className={styles.description_skeleton} />

                <div className={styles.buttons_skeleton}>
                    <div className={styles.button_skeleton} />
                    <div className={styles.button_skeleton} />
                </div>
            </div>
        </div>
    );
};
