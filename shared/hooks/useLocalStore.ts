"use client";

import { useEffect, useRef } from "react";

export interface ILocalStore {
    destroy(): void;
}

export const useLocalStore = <T extends ILocalStore>(createStore: () => T): T => {
    const storeRef = useRef<T | null>(null);

    if (storeRef.current == null) {
        storeRef.current = createStore();
    }

    useEffect(() => {
        return () => storeRef.current?.destroy();
    }, []);

    // eslint-disable-next-line react-hooks/refs
    return storeRef.current;
};
