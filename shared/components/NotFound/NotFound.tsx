"use client";

import { useRouter } from "next/navigation";
import { Text } from "@/shared/components/Text";
import { Button } from "@/shared/components/Button";
import { ROUTES } from "@/shared/config/routes";

import styles from "./NotFound.module.scss";

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <div className={styles.not_found_container}>
            <Text view="title" tag="h1" weight="bold">
                404
            </Text>
            <Text view="p-20" tag="p" color="secondary">
                Эта страница не существует или была удалена.
            </Text>
            <Button
                type="button"
                className={styles.all_films}
                onClick={() => router.push(ROUTES.films.get())}
            >
                Все фильмы
            </Button>
        </div>
    );
}
