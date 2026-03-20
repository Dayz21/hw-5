import { action, computed, makeObservable, observable } from "mobx";
import { STORAGE_KEYS } from "@/shared/config/config";

export type ToastType = "success" | "error";

export type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

export enum NotificationPreference {
    ALL = "all",
    ONLY_ERRORS = "errors",
    DISABLED = "disabled",
}

export class ToastStore {
    toasts: Toast[] = [];
    private _notificationPreference: NotificationPreference = NotificationPreference.ALL;
    private _nextId = 0;

    constructor() {
        makeObservable<this, "_notificationPreference">(this, {
            toasts: observable,
            _notificationPreference: observable,
            notificationPreference: computed,
            show: action.bound,
            remove: action.bound,
            setNotificationPreference: action.bound,
        });
        this.hydrateNotificationPreference();
    }

    get notificationPreference() {
        return this._notificationPreference;
    }

    private hydrateNotificationPreference() {
        if (typeof window === "undefined") {
            this._notificationPreference = NotificationPreference.ONLY_ERRORS;
            return;
        }

        const preference = localStorage.getItem(
            STORAGE_KEYS.notificationPreference,
        ) as NotificationPreference | null;

        if (preference !== null && preference in NotificationPreference) {
            this._notificationPreference = preference;
            return;
        }

        this._notificationPreference = NotificationPreference.ONLY_ERRORS;
    }

    private getNotificationPreferenceFromStorage(): NotificationPreference {
        if (typeof window === "undefined") {
            return NotificationPreference.ONLY_ERRORS;
        }

        const preference = localStorage.getItem(
            STORAGE_KEYS.notificationPreference,
        ) as NotificationPreference | null;
        if (
            preference === NotificationPreference.ALL ||
            preference === NotificationPreference.ONLY_ERRORS ||
            preference === NotificationPreference.DISABLED
        ) {
            return preference;
        }

        return NotificationPreference.ONLY_ERRORS;
    }

    setNotificationPreference(preference: NotificationPreference) {
        this._notificationPreference = preference;
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.notificationPreference, preference);
        }
    }

    show(message: string, type: ToastType = "success") {
        const preference = this.getNotificationPreferenceFromStorage();

        if (preference === NotificationPreference.DISABLED) {
            return;
        }

        if (preference === NotificationPreference.ONLY_ERRORS && type !== "error") {
            return;
        }

        const id = this._nextId++;
        this.toasts.push({ id, message, type });
        setTimeout(() => this.remove(id), 3000);
    }

    remove(id: number) {
        this.toasts = this.toasts.filter((t) => t.id !== id);
    }
}
