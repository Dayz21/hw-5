import { action, computed, makeObservable, observable, runInAction } from "mobx";
import type { FavoriteType } from "../models/Favorite";
import { FavoritesAPI } from "@/shared/api/FavoritesAPI";

type PrivateFields = "_ids" | "_isLoading";

export class FavoritesStore {
    private _ids: number[] = [];
    private _favorites: Record<number, FavoriteType> = {};
    private _isLoading = false;

    constructor() {
        makeObservable<this, PrivateFields>(this, {
            _ids: observable.ref,
            _isLoading: observable,
            favorites: computed,
            isLoading: computed,
            fetchFavorites: action.bound,
            clear: action.bound,
            addFavorite: action.bound,
            removeFavorite: action.bound,
            toggleFavorite: action.bound,
        });
    }

    get favorites() {
        return this._ids.map((id) => this._favorites[id]);
    }

    get isLoading() {
        return this._isLoading;
    }

    clear() {
        this._ids = [];
        this._favorites = {};
        this._isLoading = false;
    }

    contains = (filmId: number) => {
        return this._ids.includes(filmId);
    };

    async fetchFavorites() {
        this._isLoading = true;
        try {
            const films = await FavoritesAPI.fetchFavorites();

            runInAction(() => {
                this._ids = films.map((film) => film.originalFilmId);
                this._favorites = films.reduce(
                    (acc, film) => {
                        acc[film.originalFilmId] = film;
                        return acc;
                    },
                    {} as Record<number, FavoriteType>,
                );
            });
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        } finally {
            runInAction(() => {
                this._isLoading = false;
            });
        }
    }

    async addFavorite(filmId: number) {
        try {
            const favorite = await FavoritesAPI.addFavorite(filmId);

            runInAction(() => {
                this._ids = [...this._ids, favorite.originalFilmId];
                this._favorites[favorite.originalFilmId] = favorite;
            });
        } catch (error) {
            console.error("Failed to add favorite", error);
        }
    }

    async removeFavorite(filmId: number) {
        try {
            await FavoritesAPI.removeFavorite(filmId);

            runInAction(() => {
                delete this._favorites[filmId];
                this._ids = this._ids.filter((id) => id !== filmId);
            });
        } catch (error) {
            console.error("Failed to remove favorite", error);
        }
    }

    async toggleFavorite(filmId: number) {
        const isFavorite = this.contains(filmId);

        if (isFavorite) {
            await this.removeFavorite(filmId);
        } else {
            await this.addFavorite(filmId);
        }
    }
}
