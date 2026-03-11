import Link from "next/link";
import { Text } from "@/shared/components/Text";
import { Button } from "@/shared/components/Button";
import { ROUTES } from "@/shared/config/routes";

import styles from "./NotFound.module.scss";

export default function NotFoundPage() {
    return (
        <div className={styles.not_found_container}>
            <Text view="title" tag="h1" weight="bold">
                404
            </Text>
            <Text view="p-20" tag="p" color="secondary">
                Эта страница не существует или была удалена.
            </Text>
            <Link href={ROUTES.films.get()} className={styles.all_films}>
                <Button>
                    Все фильмы
                </Button>
            </Link>
        </div>
    );
}
