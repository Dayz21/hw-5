import type { ILocalStore } from "@/shared/hooks/useLocalStore";
import { FilmsAPI } from "@/shared/api/FilmsAPI";
import { COUNT_OF_RECOMMENDATIONS } from "@/shared/config/config";
import type { FilmType } from "@/shared/store/models/Film";
import { action, computed, makeObservable, observable, runInAction } from "mobx";

type PrivateFields = "_film" | "_recommendations" | "_isFilmLoading" | "_isRecommendationsLoading";

export class FilmStore implements ILocalStore {
    private _film: FilmType | null = null;
    private _recommendations: FilmType[] = [];
    private _isFilmLoading = false;
    private _isRecommendationsLoading = false;

    constructor() {
        makeObservable<this, PrivateFields>(this, {
            _film: observable.ref,
            _recommendations: observable.ref,
            _isFilmLoading: observable,
            _isRecommendationsLoading: observable,
            film: computed,
            recommendations: computed,
            isFilmLoading: computed,
            isRecommendationsLoading: computed,
            resetFilm: action.bound,
            fetchFilm: action.bound,
            fetchRecommendations: action.bound,
        });
    }

    get film() {
        return this._film;
    }

    get recommendations() {
        return this._recommendations;
    }

    get isFilmLoading() {
        return this._isFilmLoading;
    }

    get isRecommendationsLoading() {
        return this._isRecommendationsLoading;
    }

    resetFilm() {
        this._film = null;
        this._isFilmLoading = false;
    }

    async fetchFilm(filmId: string) {
        this._film = null;
        this._isFilmLoading = true;

        try {
            const film = await FilmsAPI.fetchFilmById(filmId);
            runInAction(() => {
                this._film = film;
            });
        } catch (error) {
            console.error("Failed to fetch film:", error);
        } finally {
            runInAction(() => {
                this._isFilmLoading = false;
            });
        }
    }

    async fetchRecommendations() {
        this._isRecommendationsLoading = true;

        try {
            const { films } = await FilmsAPI.fetchFilms({
                page: 1,
                pageSize: COUNT_OF_RECOMMENDATIONS,
                filters: { isFeatured: true },
            });

            runInAction(() => {
                this._recommendations = films;
            });
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
        } finally {
            runInAction(() => {
                this._isRecommendationsLoading = false;
            });
        }
    }

    destroy() {
        this._film = null;
        this._recommendations = [];
        this._isFilmLoading = false;
        this._isRecommendationsLoading = false;
    }
}
