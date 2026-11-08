/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    poweredByHeader: false,
    // webp-converter runs the cwebp binary shipped in its own package folder: keeping it
    // out of the server bundle lets it find node_modules/webp-converter/bin at runtime
    // (this replaces the old script.sh that copied the binaries into .next/server).
    serverExternalPackages: ["webp-converter"],
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
