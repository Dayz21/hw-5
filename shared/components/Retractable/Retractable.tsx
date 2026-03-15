import React from "react";
import styles from "./Retractable.module.scss";
import classNames from "classnames";

type RetractableType = {
    active: boolean;
    children: React.ReactNode;
    className?: string;
};

export const Retractable = ({ active, children, className }: RetractableType) => {
    return (
        <div className={classNames(styles.retractable, { [styles.active]: active }, className)}>
            <div className={styles.container}>{children}</div>
        </div>
    );
};
