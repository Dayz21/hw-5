import { action, computed, makeObservable, observable } from "mobx";
import { STORAGE_KEYS } from "@/shared/config/config";

export type ToastType = "success" | "error";
export type NotificationPreference = "all" | "errors" | "disabled";

export type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

export class ToastStore {
    toasts: Toast[] = [];
    private _notificationPreference: NotificationPreference = "all";
    private _nextId = 0;

    constructor() {
        makeObservable(this, {
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
            this._notificationPreference = "all";
            return;
        }

        const preference = localStorage.getItem(STORAGE_KEYS.notificationPreference);

        if (preference === "all" || preference === "errors" || preference === "disabled") {
            this._notificationPreference = preference;
            return;
        }

        this._notificationPreference = "all";
    }

    private getNotificationPreferenceFromStorage(): NotificationPreference {
        if (typeof window === "undefined") {
            return "all";
        }

        const preference = localStorage.getItem(STORAGE_KEYS.notificationPreference);
        if (preference === "all" || preference === "errors" || preference === "disabled") {
            return preference;
        }

        return "all";
    }

    setNotificationPreference(preference: NotificationPreference) {
        this._notificationPreference = preference;
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.notificationPreference, preference);
        }
    }

    show(message: string, type: ToastType = "success") {
        const preference = this.getNotificationPreferenceFromStorage();

        if (preference === "disabled") {
            return;
        }

        if (preference === "errors" && type !== "error") {
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
