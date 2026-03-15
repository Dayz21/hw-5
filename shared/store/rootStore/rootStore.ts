import { FavoritesStore } from "./favoritesStore";
import { UserStore } from "./userStore";
import { ToastStore } from "./toastStore";

class RootStoreClass {
    readonly toastStore = new ToastStore();
    readonly userStore = new UserStore();
    readonly favoritesStore = new FavoritesStore(this.toastStore);
}

export const rootStore = new RootStoreClass();
