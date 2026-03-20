import type { Metadata } from "next";
import { serverFetchCategories } from "@/shared/api/server/ServerCategoriesAPI";
import { CollectionsClient } from "./_components/CollectionsClient";

export const metadata: Metadata = {
    title: "Подборки",
    description: "Фильмы и сериалы, сгруппированные по жанрам и категориям.",
};

export default async function CollectionsPage() {
    const categories = await serverFetchCategories();

    return <CollectionsClient categories={categories} />;
}
