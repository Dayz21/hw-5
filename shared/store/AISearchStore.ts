import { makeObservable, observable } from "mobx";
import { FilmFiltersType } from "../api/types/Film";
import { FilmType } from "./models/Film";
import { PaginationType } from "./models/Pagination";

type PrivateFields = "_films" | "_filters" | "_pagination";

export class AISearchStore {
    private _films: FilmType[] = [];
    private _filters: FilmFiltersType = {};
    private _pagination: PaginationType | null = null;

    constructor () {
        makeObservable<this, PrivateFields>(this, {
            _films: observable.ref,
            _filters: observable.ref,
            _pagination: observable.ref,
        });
    }

    get films() {
        return [...this._films];
    }

    get filters() {
        return {...this._filters};
    }

    get pagination() {
        return this._pagination ? {...this._pagination} : null;
    }

    async search(prompt: string) {
        
    }
}