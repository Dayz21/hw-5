"use client";

import { Text } from "@/components/Text";
import { ArrowRightIcon } from "@/components/Icons/ArrowRightIcon";
import classNames from "classnames";

import styles from "./BackButton.module.scss";

type Props = {
    onClick: () => void;
    className?: string;
};

export const BackButton: React.FC<Props> = ({ onClick, className }) => {
    return (
        <button className={classNames(styles.back_button, className)} onClick={onClick}>
            <ArrowRightIcon angle={180} size={32} />
            <Text view="p-20" className={styles.back_button_text}>
                Назад
            </Text>
        </button>
    );
};
