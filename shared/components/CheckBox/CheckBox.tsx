"use client";

import classNames from "classnames";
import React, { useId } from "react";

import styles from "./CheckBox.module.scss";
import { CheckIcon } from "../Icons/CheckIcon";

export type CheckBoxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
    size?: number | string;
    className?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

export const CheckBox: React.FC<CheckBoxProps> = ({
    className,
    checked,
    onChange,
    size,
    ...props
}) => {
    const id = useId();
    return (
        <label
            htmlFor={id}
            className={classNames(styles.checkbox_container, className, {
                [styles.checked]: checked,
                [styles.disabled]: props.disabled,
            })}
            style={{ width: size, height: size }}
        >
            <CheckIcon
                className={styles.check_icon}
                color={props.disabled ? "disabled" : "accent"}
                size={size || 40}
            />
            <input
                id={id}
                disabled={props.disabled}
                type="checkbox"
                checked={checked}
                className={styles.checkbox}
                onChange={(e) => onChange(e.target.checked)}
                {...props}
            />
        </label>
    );
};
