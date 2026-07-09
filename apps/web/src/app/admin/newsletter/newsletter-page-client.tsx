"use client";

import { useState, useMemo } from "react";
import SubscriberList from "./subscriber-list";
import RegisteredUsersList from "./registered-users-list";
import NewsletterComposer from "./newsletter-composer";

interface Subscriber {
  email: string;
  source: string;
  subscribedAt: string;
}

interface RegisteredUser {
  email: string;
  name: string | null;
  plan: string;
  joinedAt: string;
}

interface Props {
  subscribers: Subscriber[];
  subscriberCount: number;
  users: RegisteredUser[];
  userCount: number;
}

export default function NewsletterPageClient({
  subscribers,
  subscriberCount,
  users,
  userCount,
}: Props) {
  const [subscriberSelected, setSubscriberSelected] = useState<Set<string>>(new Set());
  const [userSelected, setUserSelected] = useState<Set<string>>(new Set());

  const allSelected = useMemo(
    () => new Set([...subscriberSelected, ...userSelected]),
    [subscriberSelected, userSelected],
  );

  return (
    <>
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-3xl font-extrabold">{subscriberCount}</div>
          <div className="text-sm text-muted mt-0.5">Active subscribers</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-extrabold">{userCount}</div>
          <div className="text-sm text-muted mt-0.5">Registered users</div>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-6">
        <SubscriberList
          subscribers={subscribers}
          selectedEmails={subscriberSelected}
          onSelectionChange={setSubscriberSelected}
        />
        <RegisteredUsersList
          users={users}
          selectedEmails={userSelected}
          onSelectionChange={setUserSelected}
        />
      </div>

      <div className="mt-6">
        <NewsletterComposer
          subscriberCount={subscriberCount}
          selectedEmails={allSelected}
          subscriberSelectedCount={subscriberSelected.size}
          userSelectedCount={userSelected.size}
        />
      </div>
    </>
  );
}
