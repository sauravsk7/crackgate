import { PostHog } from "posthog-node";

let _client: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (!_client) {
    _client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      enableExceptionAutocapture: true,
    });
    // Flush buffered events before the process exits so deploys / restarts
    // don't silently drop analytics.
    process.on("SIGTERM", () => { _client?.flush(); });
    process.on("SIGINT",  () => { _client?.flush(); });
  }
  return _client;
}
