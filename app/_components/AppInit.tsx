"use client";

import { useEffect } from "react";
import { rootStore } from "@/shared/store/rootStore";

export function AppInit() {
    useEffect(() => {
        const init = async () => {
            await rootStore.userStore.fetchMe();
            if (rootStore.userStore.isAuthorized) {
                rootStore.favoritesStore.fetchFavorites();
            }
        };

        init();
    }, []);

    return null;
}
