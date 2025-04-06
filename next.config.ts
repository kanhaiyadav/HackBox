import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    images: {
        domains: ["static-cdn.jtvnw.net"],
    },
};

export default nextConfig;
