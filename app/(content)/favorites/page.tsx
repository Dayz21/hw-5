import type { Metadata } from "next";
import { FavoritesClient } from "./_components/FavoritesClient";

export const metadata: Metadata = {
    title: "Избранное",
    description: "Фильмы, которые вы сохранили в избранное.",
};

export default function FavoritesPage() {
    return <FavoritesClient />;
}
