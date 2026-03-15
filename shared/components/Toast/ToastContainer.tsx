"use client";

import { observer } from "mobx-react-lite";
import { rootStore } from "@/shared/store/rootStore";

import styles from "./Toast.module.scss";
import { Text } from "../Text";

export const ToastContainer = observer(() => {
    const { toasts } = rootStore.toastStore;

    if (!toasts.length) return null;

    return (
        <div className={styles.container}>
            {toasts.map((toast) => (
                <Text
                    key={toast.id}
                    className={`${styles.toast} ${styles[toast.type]}`}
                    onClick={() => rootStore.toastStore.remove(toast.id)}
                    view="p-14"
                    color="primary"
                    weight="medium"
                    maxLines={2}
                >
                    {toast.message}
                </Text>
            ))}
        </div>
    );
});
