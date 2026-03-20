import { toCategoryType, type CategoryType } from "@/shared/store/models/Category";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function serverFetchCategories(fetchOptions?: RequestInit): Promise<CategoryType[]> {
    const res = await fetch(`${API_URL}/film-categories`, {
        next: { revalidate: 3600, tags: ["categories"] },
        ...fetchOptions,
    });

    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);

    const data = await res.json();

    return data.data.map(toCategoryType);
}
