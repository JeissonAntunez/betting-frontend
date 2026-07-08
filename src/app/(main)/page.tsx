import { getMatches } from "@/services/matchService";
import { MatchGrid } from "@/components/match/MatchGrid";
import { MatchCard } from "@/components/match/MatchCard";
import { MatchLeeter } from "@/components/match/MatchLeeter";

/**
 * Home — Server Component.
 * Trae los partidos directamente en el servidor (sin loading spinner en el
 * primer render). Las actualizaciones de cuota en vivo se aplican client-side
 * en un wrapper aparte (ver LiveMatchesSection si decides separarlo), usando
 * useOddsSocket sobre estos datos iniciales.
 *
 * BACKEND: este fetch llama a GET /api/matches en Spring Boot. Mientras no
 * tengas el backend listo, puedes mockear `getMatches` para desarrollar el
 * frontend de forma aislada (ver services/matchService.ts).
 */
export default async function HomePage() {
  const matches = await getMatches();

  return (
    <div className="space-y-6 bg-blue-500">
      
      <section>
        <h1 className="mb-3 text-base font-bold text-neutral-800">Súmate a la acción</h1>
        
        <MatchGrid matches={matches} emptyMessage="No hay partidos programados por ahora." />
      </section>
    </div>
  );
}
