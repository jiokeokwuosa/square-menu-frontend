export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
      <h2 className="text-sm font-semibold text-red-700">Unable to load menu</h2>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
      >
        Retry
      </button>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-8 text-center">
      <p className="text-sm text-zinc-600">{message}</p>
    </section>
  );
}

export function LoadingState() {
  return (
    <section className="mt-4 grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-xl border border-zinc-200 bg-white p-3">
          <div className="mb-3 h-36 rounded-lg bg-zinc-200" />
          <div className="mb-2 h-4 w-2/3 rounded bg-zinc-200" />
          <div className="mb-2 h-3 w-full rounded bg-zinc-200" />
          <div className="h-3 w-4/5 rounded bg-zinc-200" />
        </div>
      ))}
    </section>
  );
}
