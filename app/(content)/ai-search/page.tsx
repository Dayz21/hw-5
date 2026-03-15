'use client'

import { Text } from "@/shared/components/Text";

import styles from "./AISearch.module.scss";
import { AIChat } from "./_components/AIChat";
import { Retractable } from "@/shared/components/Retractable/Retractable";
import { useState } from "react";

export default function AISearch() {
    return (
        <>
            <Retractable active={true}>
                <Text tag="h1" view="title" align="center" className={styles.title}>Поиск с ИИ</Text>
                <Text tag="h2" view="subtitle" color="secondary" align="center" className={styles.subtitle}>
                    Опиши, что ты хотел бы посмотреть сегодня вечером, <br />
                    а умный ИИ-ассистент поможет это осуществить.
                </Text>
            </Retractable>

            <AIChat />
        </>
    );
}