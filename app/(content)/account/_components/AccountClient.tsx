"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Text } from "@/shared/components/Text";
import { Button } from "@/shared/components/Button";
import { AccountSkeleton } from "./AccountSkeleton";
import { AccountOptionSelector } from "./AccountOptionSelector";
import { ROUTES } from "@/shared/config/routes";
import { rootStore } from "@/shared/store/rootStore";
import type { NotificationPreference, ThemePreference } from "@/shared/store/rootStore/userStore";
import type { AccountOption } from "./AccountOptionSelector";

import styles from "../AccountPage.module.scss";

const notificationOptions: AccountOption<NotificationPreference>[] = [
    { value: "all", label: "Все" },
    { value: "errors", label: "Только ошибки" },
    { value: "disabled", label: "Отключены" },
];

const themeOptions: AccountOption<ThemePreference>[] = [
    { value: "dark", label: "Темная" },
    { value: "light", label: "Светлая" },
];

export const AccountClient = observer(() => {
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const { user, isLoading, isAuthorized, notificationPreference, themePreference } =
        rootStore.userStore;

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const handleLogout = async () => {
        await rootStore.userStore.logout();
        router.push(ROUTES.login.get());
    };

    if (!isHydrated) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Аккаунт
                </Text>
                <AccountSkeleton />
            </>
        );
    }

    if (!isAuthorized && !isLoading) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Аккаунт
                </Text>
                <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                    Войдите, чтобы увидеть данные профиля.
                </Text>
                <div className={styles.actions}>
                    <Button onClick={() => router.push(ROUTES.login.get())}>Войти</Button>
                    <Button outlined onClick={() => router.push(ROUTES.register.get())}>
                        Регистрация
                    </Button>
                </div>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Аккаунт
                </Text>
                <AccountSkeleton />
            </>
        );
    }

    if (!isAuthorized || user === null) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Аккаунт
                </Text>
                <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                    Не получилось загрузить профиль. Попробуйте войти заново.
                </Text>
                <div className={styles.actions}>
                    <Button onClick={handleLogout}>Выйти</Button>
                    <Button outlined onClick={() => router.push(ROUTES.login.get())}>
                        Войти снова
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Аккаунт
            </Text>
            <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                Данные профиля и быстрые действия.
            </Text>
            <div className={styles.card}>
                <div className={styles.item}>
                    <Text view="p-20" weight="medium" className={styles.item_label}>
                        Имя пользователя
                    </Text>
                    <Text view="p-20" color="secondary" className={styles.item_value}>
                        {user.username}
                    </Text>
                </div>
                <div className={styles.item}>
                    <Text view="p-20" weight="medium" className={styles.item_label}>
                        Email
                    </Text>
                    <Text view="p-20" color="secondary" className={styles.item_value}>
                        {user.email}
                    </Text>
                </div>
                <div className={styles.item}>
                    <Text view="p-20" weight="medium" className={styles.item_label}>
                        Тип уведомлений
                    </Text>
                    <AccountOptionSelector
                        options={notificationOptions}
                        value={notificationPreference}
                        onChange={(value) => rootStore.userStore.setNotificationPreference(value)}
                        className={styles.item_value}
                    />
                </div>
                <div className={styles.item}>
                    <Text view="p-20" weight="medium" className={styles.item_label}>
                        Тема интерфейса
                    </Text>
                    <AccountOptionSelector
                        options={themeOptions}
                        value={themePreference}
                        onChange={(value) => rootStore.userStore.setThemePreference(value)}
                        className={styles.item_value}
                    />
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => router.push(ROUTES.favorites.get())}>Избранное</Button>
                    <Button outlined onClick={handleLogout}>
                        Выйти
                    </Button>
                </div>
            </div>
        </>
    );
});
