import type { Metadata } from "next";
import { LoginForm } from "./_components/LoginForm";

export const metadata: Metadata = {
    title: "Вход",
    description: "Войдите в аккаунт, чтобы сохранять фильмы в избранное и получать рекомендации.",
};

export default function LoginPage() {
    return <LoginForm />;
}
