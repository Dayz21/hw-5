import type { Metadata } from "next";
import { AccountClient } from "./_components/AccountClient";

export const metadata: Metadata = {
    title: "Аккаунт",
    description: "Данные профиля и быстрые действия.",
};

export default function AccountPage() {
    return <AccountClient />;
}
