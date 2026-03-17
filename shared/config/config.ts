export const COUNT_OF_FILMS_ON_PAGE = 12;
export const COUNT_OF_RECOMMENDATIONS = 12;
export const COUNT_OF_FILMS_ON_CATEGORIES_PAGE = 4;

export const STORAGE_KEYS = {
    token: "token",
    notificationPreference: "notificationPreference",
    themePreference: "themePreference",
} as const;

export const DESKTOP_WIDTH = 1440;
export const LAPTOP_WIDTH = 1024;
export const TABLET_WIDTH = 768;
export const MOBILE_WIDTH = 425;
export const CARD_HEIGHT = 670 + 16; // height + margin

export const YEAR_MIN = 1900;
export const YEAR_MAX = 2100;

export const RATING_MIN = 0;
export const RATING_MAX = 10;

export const DURATION_MIN = 1;
export const DURATION_MAX = 600;

export const AGE_LIMIT_OPTIONS: { key: string; value: string }[] = [
    { key: "0", value: "0+" },
    { key: "6", value: "6+" },
    { key: "12", value: "12+" },
    { key: "16", value: "16+" },
    { key: "18", value: "18+" },
];

export const AI_MODEL = "claude-sonnet-4-6";
export const AI_MAX_TOKENS = 512;
