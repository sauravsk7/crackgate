"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (pathname && ph) {
      ph.capture("$pageview");
    }
  }, [pathname, searchParams, ph]);

  return null;
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}

function IdentifyUser({ user }: { user: { id: string; email?: string; name?: string } }) {
  const ph = usePostHog();

  useEffect(() => {
    if (ph) {
      ph.identify(user.id, { email: user.email, name: user.name });
    }
  }, [ph, user.id, user.email, user.name]);

  return null;
}

export function PostHogProvider({ children, user }: { children: React.ReactNode; user?: { id: string; email?: string; name?: string } | null }) {
  if (typeof window === "undefined" || !key) return <>{children}</>;

  posthog.init(key, {
    api_host: host || "https://app.posthog.com",
    capture_pageview: false,
  });

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {user && <IdentifyUser user={user} />}
      {children}
    </PHProvider>
  );
}
