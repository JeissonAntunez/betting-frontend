import { Match } from "@/types";
import { MatchCard } from "./MatchCard";

interface MatchGridProps {
  matches: Match[];
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * Lista/Grid de partidos. Es deliberadamente una lista vertical (no grid CSS)
 * porque el patrón visual de casas de apuestas (Betano, Bet365) es de filas,
 * pero el contenedor padre sí es responsive: ancho completo en mobile,
 * limitado por el layout de 2/3 columnas en desktop (ver page.tsx).
 */
export function MatchGrid({ matches, isLoading, emptyMessage }: MatchGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-md bg-neutral-100" />
        
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
    <div className="relative rounded-lg border border-neutral-100 bg-white">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
