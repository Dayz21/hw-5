import { useEffect } from "react";
import { Text } from "@/shared/components/Text";
import { Button } from "@/shared/components/Button";
import { logger } from "@/shared/utils/logger";

import styles from "./Error.module.scss";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        logger.error("Unhandled page error", error);
    }, [error]);

    return (
        <div className={styles.error_container}>
            <Text view="title" tag="h1" weight="bold">
                Ошибка
            </Text>
            <Text view="p-20" tag="p" color="secondary">
                Что-то пошло не так. Попробуйте обновить страницу.
            </Text>
            <Button className={styles.reset} onClick={reset}>
                Попробовать снова
            </Button>
        </div>
    );
}
