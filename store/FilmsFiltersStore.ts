import { action, computed, makeObservable, observable } from "mobx";
import type { Option } from "@/components/MultiDropdown/MultiDropdown";
import type { ILocalStore } from "@/hooks/useLocalStore";
import type { FilmFiltersType } from "@/api/types/Film";

export type FilmsSortField = "rating" | "releaseYear";
export type FilmsSortOrder = "asc" | "desc";

type PrivateFields =
    | "_selectedCategories"
    | "_selectedAgeLimits"
    | "_search"
    | "_releaseYearFrom"
    | "_releaseYearTo"
    | "_ratingFrom"
    | "_ratingTo"
    | "_durationFrom"
    | "_durationTo"
    | "_sortField"
    | "_sortOrder";

export class FilmsFiltersStore implements ILocalStore {
    private _selectedCategories: Option[] = [];
    private _selectedAgeLimits: Option[] = [];
    private _search: string = "";

    private _releaseYearFrom: number | null = null;
    private _releaseYearTo: number | null = null;
    private _ratingFrom: number | null = null;
    private _ratingTo: number | null = null;
    private _durationFrom: number | null = null;
    private _durationTo: number | null = null;

    private _sortField: FilmsSortField | null = null;
    private _sortOrder: FilmsSortOrder | null = null;

    constructor() {
        makeObservable<this, PrivateFields>(this, {
            _selectedCategories: observable.ref,
            _selectedAgeLimits: observable.ref,
            _search: observable,
            _releaseYearFrom: observable,
            _releaseYearTo: observable,
            _ratingFrom: observable,
            _ratingTo: observable,
            _durationFrom: observable,
            _durationTo: observable,
            _sortField: observable,
            _sortOrder: observable,

            selectedCategories: computed,
            selectedAgeLimits: computed,
            search: computed,
            releaseYearFrom: computed,
            releaseYearTo: computed,
            ratingFrom: computed,
            ratingTo: computed,
            durationFrom: computed,
            durationTo: computed,
            sortField: computed,
            sortOrder: computed,
            sort: computed,
            filters: computed,

            setFilters: action.bound,
            setAgeLimits: action.bound,
            setSearchText: action.bound,
            setAdvancedFilters: action.bound,
            setReleaseYearFrom: action.bound,
            setReleaseYearTo: action.bound,
            setRatingFrom: action.bound,
            setRatingTo: action.bound,
            setDurationFrom: action.bound,
            setDurationTo: action.bound,
            setSort: action.bound,
            reset: action.bound,
        });
    }

    get selectedCategories(): Option[] {
        return this._selectedCategories;
    }

    get selectedAgeLimits(): Option[] {
        return this._selectedAgeLimits;
    }

    get search() {
        return this._search;
    }

    get releaseYearFrom() {
        return this._releaseYearFrom;
    }

    get releaseYearTo() {
        return this._releaseYearTo;
    }

    get ratingFrom() {
        return this._ratingFrom;
    }

    get ratingTo() {
        return this._ratingTo;
    }

    get durationFrom() {
        return this._durationFrom;
    }

    get durationTo() {
        return this._durationTo;
    }

    get sortField() {
        return this._sortField;
    }

    get sortOrder() {
        return this._sortOrder;
    }

    get sort(): string[] | undefined {
        if (!this._sortField || !this._sortOrder) return undefined;
        return [`${this._sortField}:${this._sortOrder}`];
    }

    get filters(): FilmFiltersType {
        return {
            categories: this._selectedCategories,
            search: this._search || undefined,
            ageLimits: this._selectedAgeLimits,
            releaseYearFrom: this._releaseYearFrom,
            releaseYearTo: this._releaseYearTo,
            ratingFrom: this._ratingFrom,
            ratingTo: this._ratingTo,
            durationFrom: this._durationFrom,
            durationTo: this._durationTo,
            sort: this.sort,
        };
    }

    setSearchText(text: string = "") {
        this._search = text;
    }

    setFilters(options: Option[] = []) {
        this._selectedCategories = options;
    }

    setAgeLimits(options: Option[] = []) {
        this._selectedAgeLimits = options;
    }

    setAdvancedFilters(filters: {
        releaseYearFrom?: number | null;
        releaseYearTo?: number | null;
        ratingFrom?: number | null;
        ratingTo?: number | null;
        durationFrom?: number | null;
        durationTo?: number | null;
    }) {
        this._releaseYearFrom = filters.releaseYearFrom ?? null;
        this._releaseYearTo = filters.releaseYearTo ?? null;
        this._ratingFrom = filters.ratingFrom ?? null;
        this._ratingTo = filters.ratingTo ?? null;
        this._durationFrom = filters.durationFrom ?? null;
        this._durationTo = filters.durationTo ?? null;
    }

    setReleaseYearFrom(value: number | null) {
        this._releaseYearFrom = value;
    }

    setReleaseYearTo(value: number | null) {
        this._releaseYearTo = value;
    }

    setRatingFrom(value: number | null) {
        this._ratingFrom = value;
    }

    setRatingTo(value: number | null) {
        this._ratingTo = value;
    }

    setDurationFrom(value: number | null) {
        this._durationFrom = value;
    }

    setDurationTo(value: number | null) {
        this._durationTo = value;
    }

    setSort(sortField: FilmsSortField | null, sortOrder: FilmsSortOrder | null) {
        this._sortField = sortField;
        this._sortOrder = sortField && sortOrder ? sortOrder : null;
    }

    reset() {
        this._selectedCategories = [];
        this._selectedAgeLimits = [];
        this._search = "";
        this._releaseYearFrom = null;
        this._releaseYearTo = null;
        this._ratingFrom = null;
        this._ratingTo = null;
        this._durationFrom = null;
        this._durationTo = null;
        this._sortField = null;
        this._sortOrder = null;
    }

    destroy() {
        this.reset();
    }
}
