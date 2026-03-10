import Link from "next/link";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { ROUTES } from "@/config/routes";

export default function FilmNotFound() {
    return (
        <>
            <Text view="title" tag="h1" weight="bold">
                Фильм не найден
            </Text>
            <Text view="p-20" tag="p" color="secondary">
                Такого фильма не существует или он был удалён.
            </Text>
            <Link href={ROUTES.films.get()}>
                <Button>Все фильмы</Button>
            </Link>
        </>
    );
}
