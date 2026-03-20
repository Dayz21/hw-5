import styles from "./_components/FilmDetail/FilmDetail.module.scss";

export default function Loading() {
    return (
        <>
            <div className={styles.back_button_skeleton} />

            <div className={styles.film}>
                <div className={styles.video_skeleton} />

                <div className={styles.info}>
                    <div className={styles.title_skeleton} />
                    <div className={styles.brief_skeleton} />
                    <div className={styles.description_skeleton_container}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={styles.description_skeleton} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
