"use client";

interface Subscriber {
  email: string;
  source: string;
  subscribedAt: string;
}

interface Props {
  subscribers: Subscriber[];
  selectedEmails: Set<string>;
  onSelectionChange: (emails: Set<string>) => void;
}

export default function SubscriberList({ subscribers, selectedEmails, onSelectionChange }: Props) {
  const allSelected = subscribers.length > 0 && selectedEmails.size === subscribers.length;
  const someSelected = selectedEmails.size > 0 && selectedEmails.size < subscribers.length;

  function toggleAll() {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(subscribers.map((s) => s.email)));
    }
  }

  function toggle(email: string) {
    const next = new Set(selectedEmails);
    if (next.has(email)) {
      next.delete(email);
    } else {
      next.add(email);
    }
    onSelectionChange(next);
  }

  return (
    <div className="mt-8 card p-5 overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg">Subscribers</h2>
        <span className="text-sm text-muted">{subscribers.length} total</span>
      </div>

      {selectedEmails.size > 0 && (
        <p className="text-xs text-muted mb-2">
          {selectedEmails.size} of {subscribers.length} selected
        </p>
      )}

      <table className="w-full text-sm">
        <thead className="text-muted text-left border-b border-line">
          <tr>
            <th className="py-2 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={toggleAll}
                className="accent-brand"
              />
            </th>
            <th className="py-2 font-medium">Email</th>
            <th className="py-2 font-medium">Source</th>
            <th className="py-2 font-medium">Subscribed</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s.email} className="border-b border-line/60">
              <td className="py-2.5">
                <input
                  type="checkbox"
                  checked={selectedEmails.has(s.email)}
                  onChange={() => toggle(s.email)}
                  className="accent-brand"
                />
              </td>
              <td className="py-2.5 font-medium">{s.email}</td>
              <td className="py-2.5 text-muted">{s.source}</td>
              <td className="py-2.5 text-muted">
                {new Date(s.subscribedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
          {subscribers.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-muted">
                No subscribers yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
