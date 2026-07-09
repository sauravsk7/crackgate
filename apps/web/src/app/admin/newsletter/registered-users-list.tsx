"use client";

interface RegisteredUser {
  email: string;
  name: string | null;
  plan: string;
  joinedAt: string;
}

interface Props {
  users: RegisteredUser[];
  selectedEmails: Set<string>;
  onSelectionChange: (emails: Set<string>) => void;
}

export default function RegisteredUsersList({ users, selectedEmails, onSelectionChange }: Props) {
  const allSelected = users.length > 0 && selectedEmails.size === users.length;
  const someSelected = selectedEmails.size > 0 && selectedEmails.size < users.length;

  function toggleAll() {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(users.map((u) => u.email)));
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
    <div className="card p-5 overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg">Registered Users</h2>
        <span className="text-sm text-muted">{users.length} total</span>
      </div>

      {selectedEmails.size > 0 && (
        <p className="text-xs text-muted mb-2">
          {selectedEmails.size} of {users.length} selected
        </p>
      )}

      <table className="w-full text-sm [&_td]:border-r [&_td]:border-line/60 [&_td:last-child]:border-r-0 [&_th]:border-r [&_th]:border-line/60 [&_th:last-child]:border-r-0">
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
            <th className="py-2 font-medium">Name</th>
            <th className="py-2 font-medium">Plan</th>
            <th className="py-2 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.email} className="border-b border-line/60">
              <td className="py-2.5">
                <input
                  type="checkbox"
                  checked={selectedEmails.has(u.email)}
                  onChange={() => toggle(u.email)}
                  className="accent-brand"
                />
              </td>
              <td className="py-2.5 font-medium truncate max-w-[200px]">{u.email}</td>
              <td className="py-2.5 text-muted truncate max-w-[150px]">{u.name ?? "—"}</td>
              <td className="py-2.5 text-muted capitalize">{u.plan}</td>
              <td className="py-2.5 text-muted whitespace-nowrap">
                {new Date(u.joinedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-muted">
                No registered users yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
