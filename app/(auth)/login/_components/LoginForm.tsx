"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { ROUTES } from "@/shared/config/routes";
import { AuthAPI } from "@/shared/api/AuthAPI";
import { rootStore } from "@/shared/store/rootStore";

import styles from "../../Auth.module.scss";

export function LoginForm() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await AuthAPI.login(identifier, password);
            await rootStore.userStore.fetchMe();
            await rootStore.favoritesStore.fetchFavorites();
            router.push(ROUTES.films.get());
        } catch (error: unknown) {
            const message =
                (error as { response?: { data?: { error?: { message?: string } } } })?.response
                    ?.data?.error?.message ?? "Неверный логин или пароль";
            rootStore.toastStore.show(message, "error");
        }
    };

    return (
        <div className={styles.auth_page}>
            <Text view="title" tag="h1" weight="bold" align="center">
                Вход
            </Text>
            <form className={styles.auth_inputs} onSubmit={handleLogin}>
                <Input
                    placeholder="Username or Email"
                    label="Имя пользователя или email"
                    value={identifier}
                    onChange={setIdentifier}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    label="Пароль"
                    value={password}
                    onChange={setPassword}
                />
                <Button type="submit">Войти</Button>
            </form>
            <Link href={ROUTES.register.get()}>
                <Text view="p-14" color="secondary" align="center">
                    Нет аккаунта? Зарегистрируйтесь
                </Text>
            </Link>
        </div>
    );
}
