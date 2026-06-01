import type { NextConfig } from "next";
import path from "node:path";

/** Backend = Next.js running in API-only mode on port 3001.
 *  CORS is opened up for the frontend dev/prod origins via headers().
 *  The actual auth (NextAuth session cookie) stays on the frontend domain
 *  in the current architecture; the backend trusts a signed JWT or the
 *  same-site cookie if both apps share a base domain in production. */
const config: NextConfig = {
  // Silence the multi-lockfile warning by pinning the trace root to this repo
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // Don't bundle Prisma — it ships native engine binaries that webpack can't pack
  serverExternalPackages: ["@prisma/client", ".prisma/client", "@crackgate/database"],
  experimental: {
    // Allow workspace packages to be picked up without transpile errors
    externalDir: true,
  },
  async headers() {
    const allowed = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin",      value: allowed },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Methods",     value: "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers",     value: "content-type,authorization,x-cron-secret" },
        ],
      },
    ];
  },
};

export default config;
