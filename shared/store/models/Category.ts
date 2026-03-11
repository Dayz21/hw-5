import type { Option } from "@/shared/components/MultiDropdown/MultiDropdown";

export type CategoryReponseType = {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    description: string;
};

export type CategoryType = {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    description: string;
};

export const toCategoryType = (response: CategoryReponseType): CategoryType => ({
    id: response.id,
    documentId: response.documentId,
    title: response.title,
    slug: response.slug,
    description: response.description,
});

export const toOptionType = (category: CategoryType): Option => ({
    key: category.documentId,
    value: category.title,
});
