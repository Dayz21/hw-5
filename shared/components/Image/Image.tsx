"use client";

import type React from "react";
import NextImage from "next/image";
import styles from "./Image.module.scss";
import classNames from "classnames";
import { useState } from "react";

export type ImageProps = {
    src: string;
    alt?: string;
    className?: string;
    width?: number | string;
    height?: number | string;
    aspect?: number;
    noAnimation?: boolean;
    sizes?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const Image: React.FC<ImageProps> = ({
    width = "100%",
    height,
    aspect = 1,
    src,
    alt = "",
    className,
    noAnimation,
    sizes = "100%",
    style,
    onClick,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <div
            className={classNames(styles.image_container, className, {
                [styles.loading]: !noAnimation && (loading || error),
                [styles.no_animation]: noAnimation,
            })}
            style={{
                width,
                height,
                aspectRatio: width && height ? undefined : aspect,
                ...style,
            }}
            onClick={onClick}
        >
            <NextImage
                loading="eager"
                src={src}
                alt={alt}
                fill
                className={styles.image}
                onLoad={() => setLoading(false)}
                onError={() => setError(true)}
                sizes={sizes}
            />
        </div>
    );
};
