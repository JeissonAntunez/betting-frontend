import Image from "next/image";
import Link from "next/link";
import { Match } from "@/types";
import { OddButton } from "./OddButton";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
}

/**
 * Fila/Card de partido (la lista tipo "Países Bajos vs Marruecos | 1 X 2").
 * Responsive: en mobile colapsa a 2 líneas (equipos arriba, cuotas abajo);
 * en desktop se mantiene en una sola fila como en el mockup original.
 */
export function MatchCard({ match }: MatchCardProps) {
  const { homeTeam, awayTeam, status, liveMinute, mainMarket, tournament, isBoosted, boostLabel } =
    match;

  return (
    <div className="flex flex-col gap-3 border-b border-neutral-100 px-3 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      {isBoosted && (
        <span className="absolute left-3 top-2 inline-flex w-fit items-center gap-1 rounded bg-[#ff00b3] px-2 py-0.5 text-[10px] font-bold text-white sm:static">
          ⚡ BB BOOST {boostLabel} fwefwfwf
        </span>
      )}

      <Link href={`/match/${match.id}`} className="flex flex-1 items-start gap-3">
        <div className="flex w-14 shrink-0 flex-col items-center text-center text-[11px] font-semibold text-neutral-500">
          {status === "LIVE" ? (
            <>
              <span className="text-[#FF5800]">{liveMinute}</span>
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF5800]" />
            </>
          ) : (
            <span>{new Date(match.startTime).toLocaleString("es-PE", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}</span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <TeamRow team={homeTeam} score={match.homeScore} />
          <TeamRow team={awayTeam} score={match.awayScore} />
          <p className="text-xs text-neutral-400">{tournament}</p>
        </div>
      </Link>

      <div className="flex gap-2 sm:w-[340px]">
        {mainMarket.odds.map((odd) => (
          <OddButton
            key={odd.id}
            odd={odd}
            matchId={match.id}
            matchLabel={`${homeTeam.name} vs ${awayTeam.name}`}
            marketName={mainMarket.name}
          />
        ))}
      </div>
    </div>
  );
}

function TeamRow({ team, score }: { team: Match["homeTeam"]; score?: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {team.flagUrl && (
          <Image
            src={team.flagUrl}
            alt={team.name}
            width={18}
            height={18}
            className="rounded-sm object-cover"
          />
        )}
        <span className="text-sm font-medium text-neutral-900">{team.name}</span>
      </div>
      {score !== undefined && <span className="text-sm font-bold">{score}</span>}
    </div>
  );
}
