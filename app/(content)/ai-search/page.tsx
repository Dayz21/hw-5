"use client";

import { Text } from "@/shared/components/Text";
import { AIChat } from "./_components/AIChat";

import styles from "./AISearch.module.scss";

export default function AISearch() {
    return (
        <>
            <div className={styles.header}>
                <Text tag="h1" view="title" align="center" weight="bold" className={styles.title}>
                    Поиск с ИИ
                </Text>
                <Text view="p-16" align="center" color="accent" className={styles.ai}>
                    AI-mode
                </Text>
            </div>
            <Text tag="h2" view="p-20" color="secondary" align="center" className={styles.subtitle}>
                Опиши, что ты хотел бы посмотреть сегодня вечером, <br />а умный ИИ-ассистент
                поможет это осуществить.
            </Text>

            <AIChat />
        </>
    );
}
