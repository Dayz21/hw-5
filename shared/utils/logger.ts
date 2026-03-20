type LogContext = Record<string, unknown>;

const isProduction = process.env.NODE_ENV === "production";
const runtime = typeof window === "undefined" ? "server" : "client";

const formatPrefix = (message: string) => `[${runtime}] ${message}`;

export const logger = {
    error(message: string, error?: unknown, context?: LogContext) {
        console.error(formatPrefix(message), { ...(context ?? {}), error });
    },

    warn(message: string, context?: LogContext) {
        console.warn(formatPrefix(message), context);
    },

    info(message: string, context?: LogContext) {
        if (isProduction) return;
        console.info(formatPrefix(message), context);
    },

    debug(message: string, context?: LogContext) {
        if (isProduction) return;
        console.debug(formatPrefix(message), context);
    },
};
