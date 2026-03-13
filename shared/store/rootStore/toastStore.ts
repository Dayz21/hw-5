import { action, makeObservable, observable } from "mobx";

export type ToastType = "success" | "error";

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

    show(message: string, type: ToastType = "success") {
        const id = this._nextId++;
        this.toasts.push({ id, message, type });
        setTimeout(() => this.remove(id), 3000);
    }

    remove(id: number) {
        this.toasts = this.toasts.filter((t) => t.id !== id);
    }
}
