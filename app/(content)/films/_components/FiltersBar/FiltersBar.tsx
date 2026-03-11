"use client";

import { useState, useEffect, useCallback, useRef, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { MultiDropdown } from "@/shared/components/MultiDropdown";
import { NumberInput } from "@/shared/components/NumberInput";
import { Text } from "@/shared/components/Text";
import type { Option } from "@/shared/components/MultiDropdown/MultiDropdown";
import type { FilmsSortField, FilmsSortOrder } from "@/shared/store/FilmsStore";
import {
    AGE_LIMIT_OPTIONS,
    YEAR_MIN,
    YEAR_MAX,
    RATING_MIN,
    RATING_MAX,
    DURATION_MIN,
    DURATION_MAX,
} from "@/shared/config/config";

import styles from "./FiltersBar.module.scss";

type InitialFilters = {
    search: string;
    categories: Option[];
    ageLimits: Option[];
    sortField: FilmsSortField | null;
    sortOrder: FilmsSortOrder | null;
    yearFrom: number | null;
    yearTo: number | null;
    ratingFrom: number | null;
    ratingTo: number | null;
    durationFrom: number | null;
    durationTo: number | null;
};

type Props = {
    categoryOptions: Option[];
    initialFilters: InitialFilters;
};

export const FiltersBar = ({ categoryOptions, initialFilters }: Props) => {
    const {
        search: initialSearch,
        categories: initialCategories,
        ageLimits: initialAgeLimits,
        sortField,
        sortOrder,
        yearFrom: initialYearFrom,
        yearTo: initialYearTo,
        ratingFrom: initialRatingFrom,
        ratingTo: initialRatingTo,
        durationFrom: initialDurationFrom,
        durationTo: initialDurationTo,
    } = initialFilters;
    const router = useRouter();
    const pathname = usePathname();
    const [, startTransition] = useTransition();

    const [searchText, setSearchText] = useState(initialSearch);
    const [localCategories, setLocalCategories] = useState(initialCategories);
    const [localAgeLimits, setLocalAgeLimits] = useState(initialAgeLimits);
    const [yearFrom, setYearFrom] = useState(initialYearFrom);
    const [yearTo, setYearTo] = useState(initialYearTo);
    const [ratingFrom, setRatingFrom] = useState(initialRatingFrom);
    const [ratingTo, setRatingTo] = useState(initialRatingTo);
    const [durationFrom, setDurationFrom] = useState(initialDurationFrom);
    const [durationTo, setDurationTo] = useState(initialDurationTo);

    const isFirstRender = useRef(true);

    const updateURL = useCallback(
        (updater: (params: URLSearchParams) => void) => {
            const params = new URLSearchParams(window.location.search);
            updater(params);
            startTransition(() => {
                router.replace(pathname + "?" + params.toString(), { scroll: false });
            });
        },
        [router, pathname],
    );

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            updateURL((params) => {
                const setOrDelete = (key: string, val: number | null) => {
                    if (val == null) params.delete(key);
                    else params.set(key, String(val));
                };
                setOrDelete("yearFrom", yearFrom);
                setOrDelete("yearTo", yearTo);
                setOrDelete("ratingFrom", ratingFrom);
                setOrDelete("ratingTo", ratingTo);
                setOrDelete("durationFrom", durationFrom);
                setOrDelete("durationTo", durationTo);
            });
        }, 400);
        return () => clearTimeout(timeout);
    }, [yearFrom, yearTo, ratingFrom, ratingTo, durationFrom, durationTo, updateURL]);

    const handleSearch = () => {
        updateURL((params) => {
            const normalized = searchText.trim();
            if (normalized) params.set("search", normalized);
            else params.delete("search");
        });
    };

    const handleSetCategories = (options: Option[]) => {
        setLocalCategories(options);
    };

    const handleCommitCategories = () => {
        const next = localCategories
            .map((o) => o.key)
            .filter(Boolean)
            .sort()
            .join(",");
        const prev = initialCategories
            .map((o) => o.key)
            .filter(Boolean)
            .sort()
            .join(",");
        if (next === prev) return;
        updateURL((params) => {
            if (next.length)
                params.set(
                    "categories",
                    localCategories
                        .map((o) => o.key)
                        .filter(Boolean)
                        .join(","),
                );
            else params.delete("categories");
        });
    };

    const handleSetAgeLimits = (options: Option[]) => {
        setLocalAgeLimits(options);
    };

    const handleCommitAgeLimits = () => {
        const next = localAgeLimits
            .map((o) => o.key)
            .filter(Boolean)
            .sort()
            .join(",");
        const prev = initialAgeLimits
            .map((o) => o.key)
            .filter(Boolean)
            .sort()
            .join(",");
        if (next === prev) return;
        updateURL((params) => {
            const keys = localAgeLimits.map((o) => o.key).filter(Boolean);
            if (keys.length) params.set("ageLimits", keys.join(","));
            else params.delete("ageLimits");
        });
    };

    const toggleSort = (field: FilmsSortField) => {
        updateURL((params) => {
            const isSameField = sortField === field;
            const currentOrder = isSameField ? sortOrder : null;

            let nextField: FilmsSortField | null = field;
            let nextOrder: FilmsSortOrder | null = "desc";

            if (!isSameField) {
                nextOrder = "desc";
            } else if (currentOrder === "desc") {
                nextOrder = "asc";
            } else if (currentOrder === "asc") {
                nextField = null;
                nextOrder = null;
            }

            if (!nextField || !nextOrder) params.delete("sort");
            else params.set("sort", `${nextField}:${nextOrder}`);
        });
    };

    const getSortLabel = (field: FilmsSortField, title: string) => {
        if (sortField !== field) return title;
        if (sortOrder === "asc") return `${title} ↑`;
        if (sortOrder === "desc") return `${title} ↓`;
        return title;
    };

    return (
        <>
            <div className={styles.search}>
                <Input value={searchText} onChange={setSearchText} placeholder="Искать фильм" />
                <Button onClick={handleSearch}>Найти</Button>
            </div>

            <div className={styles.filters}>
                <MultiDropdown
                    options={categoryOptions}
                    getTitle={(value) => value.map((el) => el.value).join(", ")}
                    value={localCategories}
                    onChange={handleSetCategories}
                    onClose={handleCommitCategories}
                    placeholder="Жанры"
                />

                <MultiDropdown
                    options={AGE_LIMIT_OPTIONS}
                    getTitle={(value) => value.map((el) => el.value).join(", ")}
                    value={localAgeLimits}
                    onChange={handleSetAgeLimits}
                    onClose={handleCommitAgeLimits}
                    placeholder="Возраст"
                />

                <Button outlined={sortField !== "rating"} onClick={() => toggleSort("rating")}>
                    {getSortLabel("rating", "Рейтинг")}
                </Button>

                <Button
                    outlined={sortField !== "releaseYear"}
                    onClick={() => toggleSort("releaseYear")}
                >
                    {getSortLabel("releaseYear", "Год")}
                </Button>
            </div>

            <div className={styles.range_filters}>
                <div className={styles.range_group}>
                    <Text view="p-14" color="secondary">
                        Год
                    </Text>
                    <div className={styles.range_pair}>
                        <NumberInput
                            value={yearFrom}
                            onChange={setYearFrom}
                            placeholder="от"
                            min={YEAR_MIN}
                            max={YEAR_MAX}
                            kind="int"
                        />
                        <NumberInput
                            value={yearTo}
                            onChange={setYearTo}
                            placeholder="до"
                            min={YEAR_MIN}
                            max={YEAR_MAX}
                            kind="int"
                        />
                    </div>
                </div>

                <div className={styles.range_group}>
                    <Text view="p-14" color="secondary">
                        Рейтинг
                    </Text>
                    <div className={styles.range_pair}>
                        <NumberInput
                            value={ratingFrom}
                            onChange={setRatingFrom}
                            placeholder="от"
                            step="0.1"
                            min={RATING_MIN}
                            max={RATING_MAX}
                            kind="float"
                        />
                        <NumberInput
                            value={ratingTo}
                            onChange={setRatingTo}
                            placeholder="до"
                            step="0.1"
                            min={RATING_MIN}
                            max={RATING_MAX}
                            kind="float"
                        />
                    </div>
                </div>

                <div className={styles.range_group}>
                    <Text view="p-14" color="secondary">
                        Длительность, мин
                    </Text>
                    <div className={styles.range_pair}>
                        <NumberInput
                            value={durationFrom}
                            onChange={setDurationFrom}
                            placeholder="от"
                            min={DURATION_MIN}
                            max={DURATION_MAX}
                            kind="int"
                        />
                        <NumberInput
                            value={durationTo}
                            onChange={setDurationTo}
                            placeholder="до"
                            min={DURATION_MIN}
                            max={DURATION_MAX}
                            kind="int"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
