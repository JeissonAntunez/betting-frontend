import { Match } from "@/types";
import { MatchCardPanel } from "./MatchCardPanel";

interface MatchGridProps {
  matches: Match[];
  isLoading?: boolean;
  emptyMessage?: string;
}


export function MatchLeeter({ matches, isLoading, emptyMessage }: MatchGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-md bg-orange-100" />
        ))}
      </div>
    );
}
  if (matches.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-neutral-400">
        {emptyMessage ?? "No hay partidos disponibles en este momento."}
      </p>
    );
  }

  return (
    <div className="flex  rounded-lg border border-neutral-100 bg-white  flex-row space-x-4 justify-center items-center overflow-x-auto overflow-y-hidden p-3">
      {matches.map((match) => (
        <MatchCardPanel key={match.id} match={match} />
      ))}
    </div>
  );
}
