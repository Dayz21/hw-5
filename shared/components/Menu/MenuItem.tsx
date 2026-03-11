"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "../Text";
import classNames from "classnames";

import styles from "./Menu.module.scss";

export type MenuItemProps = {
    content: React.ReactNode;
    path: string;
    isMobile?: boolean;
    isIcon?: boolean;
    onClick?: () => void;
};

export const MenuItem: React.FC<MenuItemProps> = ({ content, path, isMobile, onClick }) => {
    const pathname = usePathname();
    const isActive = pathname === path;

    return (
        <Link
            prefetch={true}
            href={path}
            className={classNames(styles.link, { [styles.active]: isActive })}
            onClick={onClick}
        >
            <Text view={isMobile ? "p-24" : "button"} color={isActive ? "accent" : "primary"}>
                {content}
            </Text>
        </Link>
    );
};
