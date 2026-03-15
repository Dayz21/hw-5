import * as React from "react";

import styles from "./Icon.module.scss";
import classNames from "classnames";

export type IconProps = React.SVGAttributes<SVGElement> & {
    className?: string;
    color?: "primary" | "secondary" | "accent" | "disabled" | "original";
    size?: number | string;
    angle?: number;
    onClick?: () => void;
};

export const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
    className,
    color = "primary",
    size = 24,
    angle = 0,
    onClick,
    children,
}) => {
    return (
        <div
            className={classNames(styles.icon, styles[color], className)}
            style={{
                height: size,
                width: size,
                transform: angle ? `rotate(${angle}deg)` : undefined,
            }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
