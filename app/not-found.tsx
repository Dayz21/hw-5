import Link from "next/link";
import { Menu } from "@/components/Menu";
import { Limiter } from "@/components/Limiter";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
    return (
        <div className="page">
            <Menu />
            <Limiter>
                <Text view="title" tag="h1" weight="bold">
                    404
                </Text>
                <Text view="p-20" tag="p" color="secondary">
                    Страница не найдена
                </Text>
                <Link href={ROUTES.films.get()}>
                    <Button>На главную</Button>
                </Link>
            </Limiter>
        </div>
    );
}
