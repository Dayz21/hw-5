import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { AuthAPI } from "@/shared/api/AuthAPI";
import { STORAGE_KEYS } from "@/shared/config/config";
import { logger } from "@/shared/utils/logger";
import type { UserType } from "../models/User";

export type NotificationPreference = "all" | "errors" | "disabled";
export type ThemePreference = "dark" | "light";

type PrivateFields = "_user" | "_isLoading" | "_notificationPreference" | "_themePreference";

export class UserStore {
    private _user: UserType | null = null;
    private _isLoading = true;
    private _notificationPreference: NotificationPreference = "all";
    private _themePreference: ThemePreference = "dark";

    constructor() {
        makeObservable<this, PrivateFields>(this, {
            _user: observable.ref,
            _isLoading: observable,
            _notificationPreference: observable,
            _themePreference: observable,
            user: computed,
            isLoading: computed,
            isAuthorized: computed,
            notificationPreference: computed,
            themePreference: computed,
            fetchMe: action.bound,
            logout: action.bound,
            clear: action.bound,
            setNotificationPreference: action.bound,
            setThemePreference: action.bound,
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

    get notificationPreference() {
        return this._notificationPreference;
    }

    get themePreference() {
        return this._themePreference;
    }

    private hydrateNotificationPreference() {
        const preference = localStorage.getItem(STORAGE_KEYS.notificationPreference);

        if (preference === "all" || preference === "errors" || preference === "disabled") {
            this._notificationPreference = preference;
            return;
        }

        this._notificationPreference = "all";
    }

    private applyThemePreference(preference: ThemePreference) {
        if (typeof document === "undefined") {
            return;
        }

        document.documentElement.setAttribute("data-theme", preference);
    }

    private hydrateThemePreference() {
        const preference = localStorage.getItem(STORAGE_KEYS.themePreference);

        if (preference === "dark" || preference === "light") {
            this._themePreference = preference;
            this.applyThemePreference(preference);
            return;
        }

        this._themePreference = "dark";
        this.applyThemePreference("dark");
    }

    setNotificationPreference(preference: NotificationPreference) {
        this._notificationPreference = preference;
        localStorage.setItem(STORAGE_KEYS.notificationPreference, preference);
    }

    setThemePreference(preference: ThemePreference) {
        this._themePreference = preference;
        localStorage.setItem(STORAGE_KEYS.themePreference, preference);
        this.applyThemePreference(preference);
    }

    clear() {
        this._user = null;
        this._isLoading = false;
        this.hydrateNotificationPreference();
        this.hydrateThemePreference();
    }

    async fetchMe() {
        this.hydrateNotificationPreference();
        this.hydrateThemePreference();

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
