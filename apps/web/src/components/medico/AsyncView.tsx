import * as React from "react";
import { ErrorState } from "@siglo/ui";

export function LoadingBlock({ label = "Carregando…", rows = 3 }: { label?: string; rows?: number }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-[#F1E4D6]/60 animate-pulse" />
      ))}
    </div>
  );
}

/** Renderiza loading → erro (com "tentar novamente") → conteúdo. */
export function AsyncView<T>({
  state,
  children,
  rows,
}: {
  state: { data: T | null; loading: boolean; error: string | null; reload: () => void };
  children: (data: T) => React.ReactNode;
  rows?: number;
}) {
  if (state.loading && !state.data) return <LoadingBlock rows={rows} />;
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
  if (!state.data) return null;
  return <>{children(state.data)}</>;
}
