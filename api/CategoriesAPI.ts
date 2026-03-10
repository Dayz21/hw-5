import { API } from "./API";
import { toCategoryType, type CategoryType } from "@/store/models/Category";

class CategoriesAPIClass {
    async fetchCategories(): Promise<CategoryType[]> {
        const response = await API.get(`/film-categories`);
        return response.data.data.map(toCategoryType);
    }
}

export const CategoriesAPI = new CategoriesAPIClass();
