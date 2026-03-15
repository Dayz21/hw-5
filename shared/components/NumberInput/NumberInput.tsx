"use client";

import React, { useState } from "react";
import { Input } from "@/shared/components/Input";

export type NumberInputKind = "int" | "float";

export type NumberInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type" | "inputMode"
> & {
    value: number | null;
    onChange: (value: number | null) => void;
    min?: number;
    max?: number;
    kind?: NumberInputKind;
    className?: string;
};

const sanitizeInt = (value: string) => value.replace(/[^\d]/g, "");

const sanitizeFloat = (value: string) => {
    const normalized = value.replace(/,/g, ".").replace(/[^\d.]/g, "");
    const [head, ...rest] = normalized.split(".");
    if (rest.length === 0) return head;
    return `${head}.${rest.join("")}`;
};

const clamp = (value: number, min?: number, max?: number) => {
    if (min != null && value < min) return min;
    if (max != null && value > max) return max;
    return value;
};

export const NumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    min,
    max,
    kind = "int",
    className,
    ...props
}) => {
    const [draft, setDraft] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);

    const inputMode: React.HTMLAttributes<HTMLInputElement>["inputMode"] =
        kind === "float" ? "decimal" : "numeric";

    const handleChange = (nextText: string) => {
        const sanitized = kind === "float" ? sanitizeFloat(nextText) : sanitizeInt(nextText);
        setDraft(sanitized);
    };

    const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
        const next = value == null ? "" : String(value);
        setDraft(next);
        setIsFocused(true);
        props.onFocus?.(e);
    };

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
        const sanitized = kind === "float" ? sanitizeFloat(draft) : sanitizeInt(draft);

        if (!sanitized.trim()) {
            onChange(null);
            setIsFocused(false);
            props.onBlur?.(e);
            return;
        }

        const parsed = Number(sanitized);
        if (!Number.isFinite(parsed)) {
            onChange(null);
            setIsFocused(false);
            props.onBlur?.(e);
            return;
        }

        const candidate = kind === "int" ? Math.trunc(parsed) : parsed;
        const clamped = clamp(candidate, min, max);
        onChange(clamped);
        setIsFocused(false);
        props.onBlur?.(e);
    };

    const text = isFocused ? draft : value == null ? "" : String(value);

    return (
        <Input
            {...props}
            className={className}
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            type="text"
            inputMode={inputMode}
        />
    );
};
