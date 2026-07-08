import { getMatchById, getMatchMarkets } from "@/services/matchService";
import { OddButton } from "@/components/match/OddButton";

interface PageProps {
  params: { id: string };
}

// GET /api/matches/{id} y GET /api/matches/{id}/markets (backend Java)
export default async function MatchDetailPage({ params }: PageProps) {
  const match = await getMatchById(params.id);
  const markets = await getMatchMarkets(params.id);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs text-neutral-400">{match.tournament}</p>
        <h1 className="text-lg font-bold">
          {match.homeTeam.name} vs {match.awayTeam.name}
        </h1>
      </header>

      {markets.map((market) => (
        <section key={market.id} className="rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-neutral-700">{market.name}</h2>
          <div className="flex flex-wrap gap-2">
            {market.odds.map((odd) => (
              <OddButton
                key={odd.id}
                odd={odd}
                matchId={match.id}
                matchLabel={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
                marketName={market.name}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
