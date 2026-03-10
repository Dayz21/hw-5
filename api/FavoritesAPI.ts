import { API } from "./API";
import { toFavoriteType, type FavoriteType } from "@/store/models/Favorite";

export type FetchFavoritesProps = {
    page: number;
    pageSize: number;
};

class FavoritesAPIClass {
    async fetchFavorites(): Promise<FavoriteType[]> {
        const response = await API.get(`/film-favorites`);

        return response.data.map(toFavoriteType);
    }

    async addFavorite(filmId: number): Promise<FavoriteType> {
        const response = await API.post(`/film-favorites/add`, {
            film: filmId,
        });

        return toFavoriteType(response.data);
    }

    async removeFavorite(filmId: number) {
        const response = await API.post(`/film-favorites/remove`, {
            film: filmId,
        });

        return response.data;
    }
}

export const FavoritesAPI = new FavoritesAPIClass();
