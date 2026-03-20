"use client";

import classNames from "classnames";
import { Button } from "@/shared/components/Button";
import styles from "../AccountPage.module.scss";

export type AccountOption<T extends string> = {
    value: T;
    label: string;
};

type AccountOptionSelectorProps<T extends string> = {
    options: AccountOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
};

export const AccountOptionSelector = <T extends string>({
    options,
    value,
    onChange,
    className,
}: AccountOptionSelectorProps<T>) => {
    return (
        <div className={classNames(styles.notifications_controls, className)}>
            {options.map((option) => (
                <Button
                    key={option.value}
                    outlined={option.value !== value}
                    className={styles.notification_option}
                    onClick={() => onChange(option.value)}
                    view="thin"
                >
                    {option.label}
                </Button>
            ))}
        </div>
    );
};
