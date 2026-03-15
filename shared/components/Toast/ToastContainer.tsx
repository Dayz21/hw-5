"use client";

import { observer } from "mobx-react-lite";
import { rootStore } from "@/shared/store/rootStore";

import styles from "./Toast.module.scss";

export const ToastContainer = observer(() => {
    const { toasts } = rootStore.toastStore;

    if (!toasts.length) return null;

    return (
        <div className={styles.container}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${styles.toast} ${styles[toast.type]}`}
                    onClick={() => rootStore.toastStore.remove(toast.id)}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
});
