"use client";

import { useEffect } from "react";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <>
            <Text view="title" tag="h1" weight="bold">
                Ошибка
            </Text>
            <Text view="p-20" tag="p" color="secondary">
                Что-то пошло не так. Попробуйте обновить страницу.
            </Text>
            <Button onClick={reset}>Попробовать снова</Button>
        </>
    );
}
