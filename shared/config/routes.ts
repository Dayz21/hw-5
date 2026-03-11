export const ROUTES = {
    components: {
        path: "/components",
        get: () => "/components",
    },

    films: {
        path: "/films",
        get: () => "/films",
    },

    film: {
        path: "/films/:filmId",
        get: (id: string) => `/films/${id}`,
    },

    recommendations: {
        path: "/recommendations",
        get: () => "/recommendations",
    },

    collections: {
        path: "/collections",
        get: () => "/collections",
    },

    account: {
        path: "/account",
        get: () => "/account",
    },

    favorites: {
        path: "/favorites",
        get: () => "/favorites",
    },

    login: {
        path: "/login",
        get: () => "/login",
    },

    register: {
        path: "/register",
        get: () => "/register",
    },
};
