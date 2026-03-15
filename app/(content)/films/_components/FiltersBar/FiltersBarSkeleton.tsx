"use client";

import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { MultiDropdown } from "@/shared/components/MultiDropdown";
import { NumberInput } from "@/shared/components/NumberInput";
import { Text } from "@/shared/components/Text";
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

export const FiltersBarSkeleton = () => {
    return (
        <div className={styles.pending}>
            <div className={styles.search}>
                <Input value="" onChange={() => {}} placeholder="Искать фильм" disabled />
                <Button onClick={() => {}} disabled>
                    Найти
                </Button>
            </div>

            <div className={styles.filters}>
                <MultiDropdown
                    options={[]}
                    getTitle={() => ""}
                    value={[]}
                    onChange={() => {}}
                    placeholder="Жанры"
                />
                <MultiDropdown
                    options={AGE_LIMIT_OPTIONS}
                    getTitle={() => ""}
                    value={[]}
                    onChange={() => {}}
                    placeholder="Возраст"
                />
                <Button outlined onClick={() => {}} disabled>
                    Рейтинг
                </Button>
                <Button outlined onClick={() => {}} disabled>
                    Год
                </Button>
            </div>

            <div className={styles.range_filters}>
                <div className={styles.range_group}>
                    <Text view="p-14" color="secondary">
                        Год
                    </Text>
                    <div className={styles.range_pair}>
                        <NumberInput
                            value={null}
                            onChange={() => {}}
                            placeholder="от"
                            min={YEAR_MIN}
                            max={YEAR_MAX}
                            kind="int"
                        />
                        <NumberInput
                            value={null}
                            onChange={() => {}}
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
                            value={null}
                            onChange={() => {}}
                            placeholder="от"
                            step="0.1"
                            min={RATING_MIN}
                            max={RATING_MAX}
                            kind="float"
                        />
                        <NumberInput
                            value={null}
                            onChange={() => {}}
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
                            value={null}
                            onChange={() => {}}
                            placeholder="от"
                            min={DURATION_MIN}
                            max={DURATION_MAX}
                            kind="int"
                        />
                        <NumberInput
                            value={null}
                            onChange={() => {}}
                            placeholder="до"
                            min={DURATION_MIN}
                            max={DURATION_MAX}
                            kind="int"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
