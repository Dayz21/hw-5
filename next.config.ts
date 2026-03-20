import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "front-school.minio.ktsdev.ru",
            },
        ],
    },
};

export default nextConfig;
