import type { ILocalStore } from "@/shared/hooks/useLocalStore";
import type { FilmFiltersType } from "@/shared/api/types/Film";
import type { FilmType } from "@/shared/store/models/Film";
import type { PaginationType } from "@/shared/store/models/Pagination";
import { action, computed, makeObservable, observable, runInAction } from "mobx";

type PrivateFields = "_films" | "_filters" | "_pagination" | "_isLoading" | "_isSearched";

type AISearchResponse = {
    films: FilmType[];
    pagination: PaginationType;
    filters: FilmFiltersType;
};

export class AISearchStore implements ILocalStore {
    private _films: FilmType[] = [];
    private _filters: FilmFiltersType = {};
    private _pagination: PaginationType | null = null;
    private _isLoading = false;
    private _isSearched = false;

    constructor() {
        makeObservable<this, PrivateFields>(this, {
            _films: observable.ref,
            _filters: observable.ref,
            _pagination: observable.ref,
            _isLoading: observable,
            _isSearched: observable,
            films: computed,
            filters: computed,
            pagination: computed,
            isLoading: computed,
            isSearched: computed,
            search: action.bound,
        });
    }

    get films() {
        return [...this._films];
    }

    get filters() {
        return { ...this._filters };
    }

    get pagination() {
        return this._pagination ? { ...this._pagination } : null;
    }

    get isLoading() {
        return this._isLoading;
    }

    get isSearched() {
        return this._isSearched;
    }

    async search(prompt: string) {
        this._isLoading = true;

        try {
            const response = await fetch("/api/ai-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: prompt }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error ?? "Не удалось выполнить AI-поиск");
            }

            const payload = data as AISearchResponse;
            runInAction(() => {
                this._films = payload.films;
                this._filters = payload.filters;
                this._pagination = payload.pagination;
                this._isSearched = true;
            });
        } finally {
            runInAction(() => {
                this._isLoading = false;
            });
        }
    }

    destroy() {
        this._films = [];
        this._filters = {};
        this._pagination = null;
        this._isLoading = false;
        this._isSearched = false;
    }
}
