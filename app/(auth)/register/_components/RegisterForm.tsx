"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { ROUTES } from "@/config/routes";
import { AuthAPI } from "@/api/AuthAPI";
import { rootStore } from "@/store/rootStore";

import styles from "../../Auth.module.scss";

export function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await AuthAPI.register({ username, email, password });
            await rootStore.userStore.fetchMe();
            router.push(ROUTES.films.get());
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <div className={styles.auth_page}>
            <Text view="title" tag="h1" weight="bold" align="center">
                Регистрация
            </Text>
            <div className={styles.auth_inputs}>
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
            </div>
            <Button onClick={handleRegister}>Зарегистрироваться</Button>
            <Link href={ROUTES.login.get()}>
                <Text view="p-14" color="secondary" align="center">
                    Уже есть аккаунт? Войдите
                </Text>
            </Link>
        </div>
    );
}
