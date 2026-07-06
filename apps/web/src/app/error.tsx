"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] grid place-items-center p-5">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-extrabold text-bad">500</h1>
        <p className="text-muted mt-3">Something went wrong on our end. Please try again.</p>
        {error.digest && (
          <p className="text-xs text-muted mt-1">Error ID: <code className="font-mono">{error.digest}</code></p>
        )}
        <button onClick={reset} className="btn btn-primary mt-6">
          Try again
        </button>
      </div>
    </div>
  );
}
