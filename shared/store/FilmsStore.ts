import type { ILocalStore } from "@/shared/hooks/useLocalStore";
import type { FilmType } from "./models/Film";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { FilmsAPI } from "@/shared/api/FilmsAPI";
import type { PaginationType } from "./models/Pagination";
import type { CategoryType } from "./models/Category";
import type { Option } from "@/shared/components/MultiDropdown/MultiDropdown";
import { CategoriesAPI } from "@/shared/api/CategoriesAPI";
import { COUNT_OF_FILMS_ON_PAGE } from "@/shared/config/config";
import { FilmsFiltersStore } from "./FilmsFiltersStore";

export type { FilmsSortField, FilmsSortOrder } from "./FilmsFiltersStore";

type PrivateFields = "_films" | "_pagination" | "_categories" | "_isFilmsLoading";

export class FilmsStore implements ILocalStore {
    private _films: FilmType[] = [];
    private _categories: CategoryType[] = [];
    private _pagination: PaginationType | null = null;
    private _isFilmsLoading = false;

    readonly filtersStore = new FilmsFiltersStore();

    constructor() {
        makeObservable<this, PrivateFields>(this, {
            _films: observable.ref,
            _pagination: observable.ref,
            _categories: observable.ref,
            _isFilmsLoading: observable,

            films: computed,
            pagination: computed,
            categories: computed,
            isFilmsLoading: computed,

            fetchFilms: action.bound,
            fetchNextFilms: action.bound,
            fetchCategories: action.bound,
        });
    }

    get films() {
        return this._films;
    }

    get pagination() {
        return this._pagination;
    }

    get categories(): Option[] {
        return this._categories.map((el) => ({
            key: el.documentId,
            value: el.title,
        }));
    }

    get isFilmsLoading() {
        return this._isFilmsLoading;
    }

    async fetchFilms(page = 1, pageSize = COUNT_OF_FILMS_ON_PAGE) {
        this._isFilmsLoading = true;

        try {
            const { films, pagination } = await FilmsAPI.fetchFilms({
                page,
                pageSize,
                filters: this.filtersStore.filters,
            });
            runInAction(() => {
                this._films = films;
                this._pagination = pagination;
            });
        } catch (error) {
            console.error("Failed to fetch films:", error);
        } finally {
            runInAction(() => {
                this._isFilmsLoading = false;
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
                filters: this.filtersStore.filters,
            });
            runInAction(() => {
                this._films = [...this._films, ...films];
                this._pagination = pagination;
            });
        } catch (error) {
            console.error("Failed to fetch next films:", error);
        }
    }

    async fetchCategories(force = false) {
        if (!force && this._categories.length > 0) return;
        try {
            const categories = await CategoriesAPI.fetchCategories();
            runInAction(() => {
                this._categories = categories;
            });
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    }

    destroy() {
        this._films = [];
        this._pagination = null;
        this._categories = [];
        this._isFilmsLoading = false;
        this.filtersStore.destroy();
    }
}
