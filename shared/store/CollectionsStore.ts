import type { ILocalStore } from "@/shared/hooks/useLocalStore";
import { CategoriesAPI } from "@/shared/api/CategoriesAPI";
import { FilmsAPI } from "@/shared/api/FilmsAPI";
import type { CategoryType } from "@/shared/store/models/Category";
import type { FilmType } from "@/shared/store/models/Film";
import type { Option } from "@/shared/components/MultiDropdown/MultiDropdown";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { COUNT_OF_FILMS_ON_CATEGORIES_PAGE } from "@/shared/config/config";

type CategoryFilmsState = {
    isLoading: boolean;
    films: FilmType[];
};

type PrivateFields = "_categories" | "_isLoading" | "_categoryFilms";

export class CollectionsStore implements ILocalStore {
    private _categories: CategoryType[] = [];
    private _isLoading = false;
    private _categoryFilms: Record<string, CategoryFilmsState> = {};

    constructor(initialCategories: CategoryType[] = []) {
        this._categories = initialCategories;
        this._categoryFilms = Object.fromEntries(
            initialCategories.map((c) => [c.documentId, { isLoading: true, films: [] }]),
        );
        makeObservable<this, PrivateFields>(this, {
            _categories: observable.ref,
            _isLoading: observable,
            _categoryFilms: observable.ref,
            categories: computed,
            isLoading: computed,
            categoryFilms: computed,
            init: action.bound,
            initWithCategories: action.bound,
            fetchCategories: action.bound,
            fetchFilmsForCategories: action.bound,
            destroy: action.bound,
        });
    }

    get categories() {
        return this._categories;
    }

    get isLoading() {
        return this._isLoading;
    }

    get categoryFilms() {
        return this._categoryFilms;
    }

    private getCategoryOption(category: CategoryType): Option {
        return { key: category.documentId, value: category.title };
    }

    getFilms(documentId: string): FilmType[] {
        return this._categoryFilms[documentId]?.films ?? [];
    }

    getCategoryLoading(documentId: string): boolean {
        return this._categoryFilms[documentId]?.isLoading ?? false;
    }

    async init() {
        await this.fetchCategories();
        await this.fetchFilmsForCategories();
    }

    async initWithCategories(categories: CategoryType[]) {
        runInAction(() => {
            this._categories = categories;
        });
        await this.fetchFilmsForCategories();
    }

    async fetchCategories() {
        this._isLoading = true;

        try {
            const categories = await CategoriesAPI.fetchCategories();
            runInAction(() => {
                this._categories = categories;
            });
        } catch (error) {
            console.error("Failed to fetch collections", error);
        } finally {
            runInAction(() => {
                this._isLoading = false;
            });
        }
    }

    async fetchFilmsForCategories() {
        const categories = this._categories;
        if (categories.length === 0) return;

        this._markCategoriesLoading(categories);
        await Promise.all(categories.map((category) => this._fetchFilmsForCategory(category)));
    }

    private _markCategoriesLoading(categories: CategoryType[]) {
        runInAction(() => {
            const next: Record<string, CategoryFilmsState> = { ...this._categoryFilms };
            for (const category of categories) {
                next[category.documentId] = {
                    isLoading: true,
                    films: next[category.documentId]?.films ?? [],
                };
            }
            this._categoryFilms = next;
        });
    }

    private _updateCategoryFilms(documentId: string, films: FilmType[]) {
        runInAction(() => {
            this._categoryFilms = {
                ...this._categoryFilms,
                [documentId]: { isLoading: false, films },
            };
        });
    }

    private async _fetchFilmsForCategory(category: CategoryType) {
        try {
            const option = this.getCategoryOption(category);
            const { films } = await FilmsAPI.fetchFilms({
                page: 1,
                pageSize: COUNT_OF_FILMS_ON_CATEGORIES_PAGE,
                filters: { categories: [option] },
            });
            this._updateCategoryFilms(category.documentId, films);
        } catch (error) {
            console.error("Failed to fetch films for category", category.title, error);
            this._updateCategoryFilms(category.documentId, []);
        }
    }

    destroy() {
        this._categories = [];
        this._categoryFilms = {};
        this._isLoading = false;
    }
}
