import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { AuthAPI } from "@/shared/api/AuthAPI";
import { STORAGE_KEYS } from "@/shared/config/config";
import { logger } from "@/shared/utils/logger";
import type { UserType } from "../models/User";

type PrivateFields = "_user" | "_isLoading";

export class UserStore {
    private _user: UserType | null = null;
    private _isLoading = true;

    constructor() {
        makeObservable<this, PrivateFields>(this, {
            _user: observable.ref,
            _isLoading: observable,
            user: computed,
            isLoading: computed,
            isAuthorized: computed,
            fetchMe: action.bound,
            logout: action.bound,
            clear: action.bound,
        });
    }

    get user() {
        return this._user;
    }

    get isLoading() {
        return this._isLoading;
    }

    get isAuthorized() {
        return this._user !== null;
    }

    clear() {
        this._user = null;
        this._isLoading = false;
    }

    async fetchMe() {
        const token = localStorage.getItem(STORAGE_KEYS.token);

        if (!token) {
            runInAction(() => {
                this._user = null;
                this._isLoading = false;
            });
            return;
        }

        runInAction(() => {
            this._isLoading = true;
        });

        try {
            const me = await AuthAPI.me();

            runInAction(() => {
                this._user = me;
            });
        } catch (error) {
            logger.error("Failed to fetch user", error);
            try {
                await AuthAPI.logout();
            } catch {
                // ignore
            }

            runInAction(() => {
                this._user = null;
            });
        } finally {
            runInAction(() => {
                this._isLoading = false;
            });
        }
    }

    async logout() {
        try {
            await AuthAPI.logout();
        } finally {
            runInAction(() => {
                this._user = null;
            });
        }
    }
}
