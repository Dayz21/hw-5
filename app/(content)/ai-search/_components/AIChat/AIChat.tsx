"use client";

import { useState, type FormEvent } from "react";
import { observer } from "mobx-react-lite";
import { Text } from "@/shared/components/Text";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { FilmsInfiniteList } from "@/shared/components/FilmsInfiniteList";
import { useLocalStore } from "@/shared/hooks/useLocalStore";
import { AISearchStore } from "@/shared/store/AISearchStore";
import { rootStore } from "@/shared/store/rootStore";
import { logger } from "@/shared/utils/logger";

import styles from "./AIChat.module.scss";

const EXAMPLE_PROMPTS = [
    "Динамичный боевик с высоким рейтингом",
    "Комедия на вечер",
    "Напряжённый триллер после 2018 года",
    "Фантастика с рейтингом от 7.5",
];

export const AIChat = observer(() => {
    const [prompt, setPrompt] = useState("");
    const [searchNonce, setSearchNonce] = useState(0);
    const store = useLocalStore(() => new AISearchStore());

    const runSearch = async (rawPrompt: string) => {
        const trimmedPrompt = rawPrompt.trim();
        if (!trimmedPrompt) {
            rootStore.toastStore.show("Опишите, что хотите посмотреть", "error");
            return;
        }

        setPrompt(trimmedPrompt);

        try {
            await store.search(trimmedPrompt);
            setSearchNonce((prev) => prev + 1);
        } catch (error: unknown) {
            logger.error("AI chat search failed", error, { prompt: trimmedPrompt });
            const message =
                error instanceof Error ? error.message : "Не удалось выполнить AI-поиск";
            rootStore.toastStore.show(message, "error");
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await runSearch(prompt);
    };

    return (
        <section className={styles.chat}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    value={prompt}
                    onChange={setPrompt}
                    placeholder="Например: хочу атмосферный триллер, рейтинг от 7 и не старше 2018"
                    label="Запрос к AI-ассистенту"
                    disabled={store.isLoading}
                />
                <Button type="submit" loading={store.isLoading} disabled={store.isLoading}>
                    Найти
                </Button>
            </form>

            <div className={styles.examples_list}>
                {EXAMPLE_PROMPTS.map((example) => (
                    <button
                        key={example}
                        type="button"
                        className={styles.example_button}
                        disabled={store.isLoading}
                        onClick={() => runSearch(example)}
                    >
                        <Text tag="span" view="p-16">
                            {example}
                        </Text>
                    </button>
                ))}
            </div>

            {store.isSearched && (
                <div className={styles.results}>
                    <div className={styles.results_header}>
                        <Text view="subtitle" weight="bold">
                            Результаты
                        </Text>
                        <Text view="p-20" color="accent">
                            {store.pagination?.total ?? store.films.length}
                        </Text>
                    </div>

                    {store.films.length === 0 || !store.pagination ? (
                        <Text view="p-20" color="secondary">
                            По этому запросу ничего не найдено. Попробуйте уточнить жанр, год или
                            рейтинг.
                        </Text>
                    ) : (
                        <FilmsInfiniteList
                            key={`ai-search-${searchNonce}`}
                            initialFilms={store.films}
                            initialPagination={store.pagination}
                            filters={store.filters}
                        />
                    )}
                </div>
            )}
        </section>
    );
});
