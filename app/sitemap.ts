import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: `${BASE_URL}/films`, changeFrequency: "daily", priority: 1 },
        { url: `${BASE_URL}/recommendations`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/collections`, changeFrequency: "weekly", priority: 0.7 },
    ];
}
