import classNames from "classnames";
import type React from "react";

import styles from "./Limiter.module.scss";

export type LimiterProps = {
    children: React.ReactNode;
    className?: string;
};

export const Limiter: React.FC<LimiterProps> = ({ children, className }) => {
    return <div className={classNames(styles.limiter, className)}>{children}</div>;
};
