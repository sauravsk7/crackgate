"use client";

import { useState } from "react";
import SubscriberList from "./subscriber-list";
import NewsletterComposer from "./newsletter-composer";

interface Subscriber {
  email: string;
  source: string;
  subscribedAt: string;
}

interface Props {
  subscribers: Subscriber[];
  subscriberCount: number;
}

export default function NewsletterPageClient({ subscribers, subscriberCount }: Props) {
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  return (
    <>
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-3xl font-extrabold">{subscriberCount}</div>
          <div className="text-sm text-muted mt-0.5">Active subscribers</div>
        </div>
      </div>

      <SubscriberList
        subscribers={subscribers}
        selectedEmails={selectedEmails}
        onSelectionChange={setSelectedEmails}
      />

      <div className="mt-6">
        <NewsletterComposer
          subscriberCount={subscriberCount}
          selectedEmails={selectedEmails}
        />
      </div>
    </>
  );
}
