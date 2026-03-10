import { ROUTES } from "@/config/routes";
import type { MenuItemProps } from "./MenuItem";
import { AccountIcon } from "../Icons/AccountIcon";
import { FavoritesIcon } from "../Icons/FavoritesIcon";

export const mobileMenuItems: MenuItemProps[] = [
    { content: "Фильмы", path: ROUTES.films.get() },
    { content: "Рекомендации", path: ROUTES.recommendations.get() },
    { content: "Подборки", path: ROUTES.collections.get() },
    { content: "Избранное", path: ROUTES.favorites.get() },
    { content: "Аккаунт", path: ROUTES.account.get() },
];

export const desktopMenuItems: MenuItemProps[] = [
    { content: "Фильмы", path: ROUTES.films.get() },
    { content: "Рекомендации", path: ROUTES.recommendations.get() },
    { content: "Подборки", path: ROUTES.collections.get() },
    { content: <FavoritesIcon size={30} />, isIcon: true, path: ROUTES.favorites.get() },
    { content: <AccountIcon size={30} />, isIcon: true, path: ROUTES.account.get() },
];
