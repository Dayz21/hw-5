import styles from "./AccountSkeleton.module.scss";
import pageStyles from "../AccountPage.module.scss";

export const AccountSkeleton = () => (
    <div className={pageStyles.card}>
        <div className={styles.row_skeleton} />
        <div className={styles.row_skeleton} />
        <div className={styles.actions_skeleton}>
            <div className={styles.button_skeleton} />
            <div className={styles.button_skeleton} />
        </div>
    </div>
);
