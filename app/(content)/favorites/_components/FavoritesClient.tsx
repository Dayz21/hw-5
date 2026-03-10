"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { FavoritesSkeleton } from "./FavoritesSkeleton";
import { ROUTES } from "@/config/routes";
import { rootStore } from "@/store/rootStore";

import styles from "../FavoritesPage.module.scss";
import listStyles from "@/components/FilmsInfiniteList/FilmsInfiniteList.module.scss";

export const FavoritesClient = observer(() => {
    const router = useRouter();
    const { isLoading: isUserLoading, isAuthorized } = rootStore.userStore;
    const { favorites, isLoading } = rootStore.favoritesStore;

    if (isUserLoading) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Избранное
                </Text>
                <FavoritesSkeleton />
            </>
        );
    }

    if (!isAuthorized) {
        return (
            <>
                <Text view="title" tag="h1" className={styles.title} weight="bold">
                    Избранное
                </Text>
                <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                    Войдите в аккаунт, чтобы видеть сохранённые фильмы.
                </Text>
                <div className={styles.actions}>
                    <Button onClick={() => router.push(ROUTES.login.get())}>Войти</Button>
                    <Button outlined onClick={() => router.push(ROUTES.register.get())}>
                        Регистрация
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Text view="title" tag="h1" className={styles.title} weight="bold">
                Избранное
            </Text>
            <Text view="p-20" tag="p" color="secondary" className={styles.subtitle}>
                Здесь собраны фильмы, которые вы добавили в избранное.
            </Text>
            <div className={styles.favorites_title}>
                <Text view="subtitle" weight="bold">
                    Все избранные
                </Text>
                <Text view="p-20" color="accent">
                    {favorites.length}
                </Text>
            </div>
            {isLoading ? (
                <FavoritesSkeleton />
            ) : favorites.length === 0 ? (
                <Text view="p-20" className={styles.empty} color="secondary">
                    Пока пусто — добавьте что-нибудь в избранное на странице фильмов.
                </Text>
            ) : (
                <div className={listStyles.films}>
                    {favorites.map(({ film }) => (
                        <Card key={film.documentId} film={film}>
                            <Button
                                onClick={() => rootStore.favoritesStore.toggleFavorite(film.id)}
                                outlined
                            >
                                В избранном
                            </Button>
                            <Button onClick={() => router.push(ROUTES.film.get(film.documentId))}>
                                Смотреть
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
});
