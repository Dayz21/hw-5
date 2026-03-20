import { action, computed, makeObservable, observable, runInAction } from "mobx";
import type { FavoriteType } from "../models/Favorite";
import { FavoritesAPI } from "@/shared/api/FavoritesAPI";
import type { ToastStore } from "./toastStore";

type PrivateFields = "_ids" | "_favorites" | "_isLoading";

export class FavoritesStore {
    private _ids: number[] = [];
    private _favorites: Record<number, FavoriteType> = {};
    private _isLoading = false;
    private _toast: ToastStore;

    constructor(toastStore: ToastStore) {
        this._toast = toastStore;
        makeObservable<this, PrivateFields>(this, {
            _ids: observable.ref,
            _favorites: observable,
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
            this._toast.show("Не удалось загрузить избранное", "error");
        } finally {
            runInAction(() => {
                this._isLoading = false;
            });
        }
    }

    async addFavorite(filmId: number) {
        this._ids = [...this._ids, filmId];
        try {
            const favorite = await FavoritesAPI.addFavorite(filmId);
            runInAction(() => {
                this._favorites[favorite.originalFilmId] = favorite;
                this._toast.show("Добавлено в избранное");
            });
        } catch (error) {
            runInAction(() => {
                this._ids = this._ids.filter((id) => id !== filmId);
                this._toast.show("Не удалось добавить в избранное", "error");
            });
        }
    }

    async removeFavorite(filmId: number) {
        const prevIds = this._ids;
        const prevFavorite = this._favorites[filmId];
        this._ids = this._ids.filter((id) => id !== filmId);
        delete this._favorites[filmId];
        try {
            await FavoritesAPI.removeFavorite(filmId);
            runInAction(() => {
                this._toast.show("Удалено из избранного");
            });
        } catch (error) {
            runInAction(() => {
                this._ids = prevIds;
                if (prevFavorite) this._favorites[filmId] = prevFavorite;
                this._toast.show("Не удалось удалить из избранного", "error");
            });
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
