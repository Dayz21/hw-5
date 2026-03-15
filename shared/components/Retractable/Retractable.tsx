import React from "react";
import styles from "./Retractable.module.scss";
import classNames from "classnames";

type RetractableType = {
    active: boolean,
    children: React.ReactNode,
};

export const Retractable = ({ active, children }: RetractableType) => {
    return (
        <div className={classNames(styles.retractable, {[styles.active]: active})}>
            <div className={styles.container}>
                {children}
            </div>
        </div>
    );
}