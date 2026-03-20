import type React from "react";
import classNames from "classnames";
import { Image } from "@components/Image";
import { Text } from "@components/Text";
import { StarIcon } from "@components/Icons/StarIcon";
import { getFormattedTime } from "@/shared/utils/getFormattedTime";
import type { FilmType } from "@/shared/store/models/Film";

import styles from "./Card.module.scss";

export type CardProps = {
    className?: string;
    film: FilmType;
    children?: React.ReactNode;
    onClick?: () => void;
};

export const Card: React.FC<CardProps> = ({ className, film, children, onClick }) => {
    const { title, description, poster, category, releaseYear, ageLimit, rating, duration } = film;

    return (
        <div className={classNames(styles.card, className)}>
            <div className={styles.rating}>
                <Text view="p-16">{rating}</Text>
                <StarIcon color="original" size={20} />
            </div>

            <div className={styles.timing}>
                <Text view="p-16">{getFormattedTime(duration)}</Text>
            </div>

            <Image
                src={poster.url}
                width="100%"
                aspect={1}
                alt={title}
                style={{ cursor: "pointer" }}
                onClick={onClick}
            />

            <div className={styles.info}>
                <div className={styles.info_container}>
                    <div className={styles.info_header}>
                        <Text view="p-16">{releaseYear}</Text>
                        <Text view="p-16">•</Text>
                        <Text view="p-16">{category.title}</Text>
                        <Text view="p-16">•</Text>
                        <Text view="p-16">{ageLimit}+</Text>
                    </div>

                    <Text view="p-20" weight="bold" maxLines={2} className={styles.title}>
                        {title}
                    </Text>
                    <Text view="p-16" maxLines={3} className={styles.description}>
                        {description}
                    </Text>
                </div>

                {children && <div className={styles.actions}>{children}</div>}
            </div>
        </div>
    );
};
