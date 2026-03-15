"use client";

import type React from "react";
import { ArrowRightIcon } from "@/shared/components/Icons/ArrowRightIcon";
import styles from "./CarouselControls.module.scss";

export type CarouselControlButtonProps = {
    onClick: () => void;
};

export const FrontControlButton: React.FC<CarouselControlButtonProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className={styles.nav_button_right}>
            <ArrowRightIcon size={30} />
        </button>
    );
};

export const BackControlButton: React.FC<CarouselControlButtonProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className={styles.nav_button_left}>
            <ArrowRightIcon size={30} angle={180} />
        </button>
    );
};
