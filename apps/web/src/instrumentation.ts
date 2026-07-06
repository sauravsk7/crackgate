// Next.js instrumentation entrypoint. Loads the right Sentry config per runtime,
// forwards nested React Server Component errors to Sentry, and starts background
// job workers for WhatsApp / digest processing.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
    // Start BullMQ workers alongside the web process. In production (docker)
    // these share the same container; extract to a separate service if throughput
    // demands it.
    const { ensureWorkers } = await import("./lib/workers");
    ensureWorkers();
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
