"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const PostHogProviderInner = dynamic(() => import("@/components/posthog-provider").then((m) => m.PostHogProvider), { ssr: false });

export function PostHogProvider({ children, user }: { children: ReactNode; user?: { id: string; email?: string; name?: string } | null }) {
  return <PostHogProviderInner user={user}>{children}</PostHogProviderInner>;
}
