import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@styles/page.scss";
import "./globals.scss";
import { AppInit } from "./_components/AppInit";
import { ToastContainer } from "@/shared/components/Toast/ToastContainer";

const roboto = Roboto({
    weight: ["400", "500", "700"],
    subsets: ["cyrillic", "latin"],
    variable: "--font-roboto",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Кинотека",
        template: "%s — Кинотека",
    },
    description: "Смотрите фильмы, сериалы и рекомендации. Найдите что посмотреть за пару секунд.",
    openGraph: {
        siteName: "Кинотека",
        locale: "ru_RU",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className={roboto.className}>
                <AppInit />
                <ToastContainer />
                {children}
            </body>
        </html>
    );
}
