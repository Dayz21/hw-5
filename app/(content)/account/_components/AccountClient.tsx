"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Text } from "@/shared/components/Text";
import { Button } from "@/shared/components/Button";
import { AccountSkeleton } from "./AccountSkeleton";
import { ROUTES } from "@/shared/config/routes";
import { rootStore } from "@/shared/store/rootStore";

import styles from "../AccountPage.module.scss";

export const AccountClient = observer(() => {
    const router = useRouter();
    const { user, isLoading, isAuthorized } = rootStore.userStore;

    const handleLogout = async () => {
        await rootStore.userStore.logout();
        router.push(ROUTES.login.get());
    };

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
                <div className={styles.row}>
                    <Text view="p-20" weight="medium">
                        Имя пользователя
                    </Text>
                    <Text view="p-20" color="secondary">
                        {user.username}
                    </Text>
                </div>
                <div className={styles.row}>
                    <Text view="p-20" weight="medium">
                        Email
                    </Text>
                    <Text view="p-20" color="secondary">
                        {user.email}
                    </Text>
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
