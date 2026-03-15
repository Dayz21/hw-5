import { action, makeObservable, observable } from "mobx";
import { STORAGE_KEYS } from "@/shared/config/config";

export type ToastType = "success" | "error";
type NotificationPreference = "all" | "errors" | "disabled";

export type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

export class ToastStore {
    toasts: Toast[] = [];
    private _nextId = 0;

    constructor() {
        makeObservable(this, {
            toasts: observable,
            show: action.bound,
            remove: action.bound,
        });
    }

    private getNotificationPreference(): NotificationPreference {
        if (typeof window === "undefined") {
            return "all";
        }

        const preference = localStorage.getItem(STORAGE_KEYS.notificationPreference);

        if (preference === "all" || preference === "errors" || preference === "disabled") {
            return preference;
        }

        return "all";
    }

    show(message: string, type: ToastType = "success") {
        const preference = this.getNotificationPreference();

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
