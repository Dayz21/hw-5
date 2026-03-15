"use client";

import React, { useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { Input } from "@components/Input";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";

import styles from "./MultiDropdown.module.scss";

export type Option = {
    key: string;
    value: string;
};

export type MultiDropdownProps = {
    className?: string;
    options: Option[];
    value: Option[];
    onChange: (value: Option[]) => void;
    onClose?: () => void;
    disabled?: boolean;
    getTitle: (value: Option[]) => string;
    placeholder?: string;
};

type DropdownElementProps = {
    data: Option;
    active: boolean;
    onClick: (data: Option) => void;
};

const DropdownElement: React.FC<DropdownElementProps> = ({ data, active, onClick }) => {
    return (
        <div
            className={classNames(styles.dropdown_element, { [styles.active]: active })}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onClick(data)}
        >
            {data.value}
        </div>
    );
};

export const MultiDropdown: React.FC<MultiDropdownProps> = ({
    className,
    options,
    value,
    onChange,
    onClose,
    disabled,
    getTitle,
    placeholder,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");

    const dropdownRef = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);

    const handleClick = (data: Option) => {
        if (value.find((el) => el.key === data.key)) {
            const changedArray = value.filter((el) => el.key !== data.key);
            onChange(changedArray);
        } else {
            const changedArray = [...value, data];
            onChange(changedArray);
        }
    };

    const handleFocus = () => {
        setIsOpen((prev) => !prev);
    };

    const handleBlur = () => {
        setIsOpen(false);
        setFilter("");
        inputRef.current?.blur();
        onClose?.();
    };

    const title = useMemo(() => getTitle(value), [value, getTitle]);

    const filteredOptions = useMemo(() => {
        return options.filter((el) => el.value.toLowerCase().includes(filter.toLowerCase().trim()));
    }, [filter, options]);

    return (
        <div
            ref={dropdownRef}
            className={classNames(styles.dropdown, className, {
                [styles.active]: !disabled && isOpen,
            })}
        >
            <Input
                ref={inputRef}
                className={styles.dropdown_input}
                disabled={disabled}
                value={isOpen ? filter : value.length !== 0 ? title : ""}
                placeholder={value.length === 0 ? placeholder || "" : title}
                onChange={setFilter}
                onFocus={handleFocus}
                onBlur={handleBlur}
                afterSlot={<ArrowRightIcon angle={90} color="secondary" size={24} />}
            />
            <div
                className={classNames(styles.dropdown_list, { [styles.open]: !disabled && isOpen })}
            >
                {filteredOptions.map((data) => (
                    <DropdownElement
                        key={data.key}
                        data={data}
                        onClick={handleClick}
                        active={!!value.find((el) => el.key === data.key)}
                    />
                ))}
            </div>
        </div>
    );
};
