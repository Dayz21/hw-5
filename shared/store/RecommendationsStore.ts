import type { ILocalStore } from "@/shared/hooks/useLocalStore";
import { FilmsAPI } from "@/shared/api/FilmsAPI";
import { COUNT_OF_FILMS_ON_PAGE } from "@/shared/config/config";
import type { FilmType } from "@/shared/store/models/Film";
import type { PaginationType } from "@/shared/store/models/Pagination";
import { action, computed, makeObservable, observable, runInAction } from "mobx";

type PrivateFields = "_films" | "_pagination" | "_isLoading";

export class RecommendationsStore implements ILocalStore {
    private _films: FilmType[] = [];
    private _pagination: PaginationType | null = null;
    private _isLoading = false;

    constructor() {
        makeObservable<this, PrivateFields>(this, {
            _films: observable.ref,
            _pagination: observable.ref,
            _isLoading: observable,
            films: computed,
            pagination: computed,
            isLoading: computed,
            seed: action.bound,
            fetchFilms: action.bound,
            fetchNextFilms: action.bound,
        });
    }

    get films() {
        return this._films;
    }

    get pagination() {
        return this._pagination;
    }

    get isLoading() {
        return this._isLoading;
    }

    seed(films: FilmType[], pagination: PaginationType) {
        runInAction(() => {
            this._films = films;
            this._pagination = pagination;
        });
    }

    async fetchFilms(page = 1, pageSize = COUNT_OF_FILMS_ON_PAGE) {
        this._isLoading = true;

        try {
            const { films, pagination } = await FilmsAPI.fetchFilms({
                page,
                pageSize,
                filters: { isFeatured: true },
            });

            runInAction(() => {
                this._films = films;
                this._pagination = pagination;
            });
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
        } finally {
            runInAction(() => {
                this._isLoading = false;
            });
        }
    }

    async fetchNextFilms() {
        if (!this._pagination || this._pagination.page >= this._pagination.pageCount) return;

        const nextPage = this._pagination.page + 1;

        try {
            const { films, pagination } = await FilmsAPI.fetchFilms({
                page: nextPage,
                pageSize: this._pagination.pageSize,
                filters: { isFeatured: true },
            });

            runInAction(() => {
                this._films = [...this._films, ...films];
                this._pagination = pagination;
            });
        } catch (error) {
            console.error("Failed to fetch next recommendations:", error);
        }
    }

    destroy() {
        this._films = [];
        this._pagination = null;
        this._isLoading = false;
    }
}
