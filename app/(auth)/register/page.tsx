import type { Metadata } from "next";
import { RegisterForm } from "./_components/RegisterForm";

export const metadata: Metadata = {
    title: "Регистрация",
    description: "Создайте аккаунт, чтобы сохранять фильмы в избранное и получать рекомендации.",
};

export default function RegisterPage() {
    return <RegisterForm />;
}
