"use client";

import React from "react";

import styles from "./Button.module.scss";
import classNames from "classnames";
import { Loader } from "@components/Loader";
import { Text } from "@components/Text";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    children: React.ReactNode;
    outlined?: boolean;
    className?: string;
    onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({
    loading,
    children,
    onClick,
    outlined,
    className,
    ...props
}) => {
    return (
        <button
            {...props}
            className={classNames(
                styles.button,
                { [styles.outlined]: outlined, [styles.loading]: loading },
                className,
            )}
            disabled={props.disabled}
            onClick={onClick}
        >
            {loading && <Loader size="s" color={outlined ? "accent" : "primary"} />}
            <Text view="button" tag="span" color={outlined ? "accent" : undefined}>
                {children}
            </Text>
        </button>
    );
};
