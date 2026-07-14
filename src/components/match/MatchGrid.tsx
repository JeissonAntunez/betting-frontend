import { Match } from "@/types";
import { MatchCard } from "./MatchCard";

interface MatchGridProps {
  matches: Match[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function MatchGrid({ matches, isLoading, emptyMessage }: MatchGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-px p-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[72px] animate-pulse bg-neutral-100"
            // altura igual a la de una MatchCard real → evita layout shift
          />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <span className="text-2xl">⚽</span>
        <p className="text-sm font-medium text-neutral-500">
          {emptyMessage ?? "No hay partidos disponibles."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
      {matches.map((match, i) => (
        <div
          key={match.id}
          className={i < matches.length - 1 ? "border-b border-neutral-100" : ""}
        >
          <MatchCard match={match} />
        </div>
      ))}
    </div>
  );
}