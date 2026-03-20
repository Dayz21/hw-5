"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { ROUTES } from "@/shared/config/routes";
import { AuthAPI } from "@/shared/api/AuthAPI";
import { rootStore } from "@/shared/store/rootStore";

import styles from "../../Auth.module.scss";

export function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await AuthAPI.register({ username, email, password });
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
                Регистрация
            </Text>
            <form className={styles.auth_inputs} onSubmit={handleRegister}>
                <Input
                    placeholder="Username"
                    label="Имя пользователя"
                    value={username}
                    onChange={setUsername}
                />
                <Input placeholder="Email" label="Email" value={email} onChange={setEmail} />
                <Input
                    placeholder="Password"
                    type="password"
                    label="Пароль"
                    value={password}
                    onChange={setPassword}
                />
                <Button type="submit">Зарегистрироваться</Button>
            </form>
            <Link href={ROUTES.login.get()}>
                <Text view="p-14" color="secondary" align="center">
                    Уже есть аккаунт? Войдите
                </Text>
            </Link>
        </div>
    );
}
