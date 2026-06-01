import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the trace root to the monorepo root so Next stops complaining about
  // multiple lockfiles and traces files from packages/database correctly.
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // Prisma ships native engine binaries — don't let webpack bundle it.
  serverExternalPackages: ["@prisma/client", ".prisma/client", "@crackgate/database"],
  experimental: {
    // Allow importing the workspace `@crackgate/database` package from outside this app dir.
    externalDir: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=(), payment=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
