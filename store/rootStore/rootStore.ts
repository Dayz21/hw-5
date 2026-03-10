import { FavoritesStore } from "./favoritesStore";
import { UserStore } from "./userStore";

class RootStoreClass {
    readonly userStore = new UserStore();
    readonly favoritesStore = new FavoritesStore();
}

export const rootStore = new RootStoreClass();
