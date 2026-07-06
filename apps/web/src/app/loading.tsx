export default function Loading() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-5">
      <div className="flex flex-col items-center gap-3">
        <div className="inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </div>
  );
}
