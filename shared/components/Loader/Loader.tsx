import type React from "react";
import styles from "./Loader.module.scss";
import classNames from "classnames";

export type LoaderProps = {
    size?: "s" | "m" | "l";
    className?: string;
    color?: "primary" | "secondary" | "accent";
};

export const Loader: React.FC<LoaderProps> = ({ size = "m", color = "accent", className }) => {
    return (
        <div
            className={classNames(
                styles.loader,
                className,
                styles[`loader_${size}`],
                styles[color],
            )}
        >
            <svg
                className={styles.loader__svg}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M23.3787 34.62C15.3068 36.4835 7.25244 31.4506 5.38888 23.3787C3.52533 15.3068 8.55822 7.25244 16.6302 5.38888C24.7021 3.52533 32.7564 8.55822 34.62 16.6302L39.4918 15.5054C37.0071 4.74282 26.268 -1.96771 15.5054 0.517031C4.74282 3.00177 -1.96771 13.7409 0.517034 24.5035C3.00177 35.266 13.7409 41.9766 24.5035 39.4918L23.3787 34.62Z" />
            </svg>
        </div>
    );
};
