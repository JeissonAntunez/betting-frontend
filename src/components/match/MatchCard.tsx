"use client";

import Image from "next/image";
import Link from "next/link";
import { Match } from "@/types";
import { OddButton } from "./OddButton";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const {
    homeTeam,
    awayTeam,
    status,
    liveMinute,
    mainMarket,
    tournament,
    isBoosted,
    boostLabel,
  } = match;

  const isLive = status === "LIVE";

  return (
    <div className="relative flex flex-col px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:py-3.5">

      {/* Badge boost — flujo normal, no absolute */}
      {isBoosted && (
        <span className="mb-2 inline-flex w-fit items-center gap-1 rounded bg-[#ff00b3] px-2 py-0.5 text-[10px] font-bold text-white sm:hidden">
          ⚡ BB BOOST {boostLabel}
        </span>
      )}

      {/* Bloque izquierdo: hora/live + equipos */}
      <Link
        href={`/match/${match.id}`}
        className="flex flex-1 items-start gap-2 min-w-0"
      >
        {/* Columna hora */}
        <div className="flex w-12 shrink-0 flex-col items-center pt-0.5 text-center">
          {isLive ? (
            <>
              <span className="text-[11px] font-bold text-[#FF5800] leading-tight">
                {liveMinute}
              </span>
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF5800]" />
            </>
          ) : (
            <>
              <span className="text-[10px] font-medium text-neutral-400 leading-tight">
                {new Date(match.startTime).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
              <span className="text-[11px] font-semibold text-neutral-600 leading-tight">
                {new Date(match.startTime).toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </>
          )}
        </div>

        {/* Equipos + torneo */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <TeamRow team={homeTeam} score={match.homeScore} isLive={isLive} />
          <TeamRow team={awayTeam} score={match.awayScore} isLive={isLive} />
          <p className="truncate text-[10px] text-neutral-400 mt-0.5">{tournament}</p>
        </div>
      </Link>

      {/* Cuotas */}
      <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:mt-0 sm:w-[220px] sm:shrink-0 lg:w-[260px]">
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

      {/* Badge boost desktop — a la derecha de las cuotas */}
      {isBoosted && (
        <span className="hidden sm:inline-flex items-center gap-1 rounded bg-[#ff00b3] px-2 py-0.5 text-[10px] font-bold text-white shrink-0">
          ⚡ {boostLabel}
        </span>
      )}
    </div>
  );
}

function TeamRow({
  team,
  score,
  isLive,
}: {
  team: Match["homeTeam"];
  score?: number;
  isLive: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 min-w-0">
      <div className="flex min-w-0 items-center gap-1.5">
        {team.flagUrl ? (
          <Image
            src={team.flagUrl}
            alt={team.name}
            width={16}
            height={16}
            className="shrink-0 rounded-sm object-cover"
          />
        ) : (
          // Fallback: código de país en texto si no hay imagen
          <span className="shrink-0 text-[11px] font-bold uppercase text-neutral-400 w-4 text-center">
            {team.id?.slice(0, 2)}
          </span>
        )}
        <span className="truncate text-sm font-medium text-neutral-900">
          {team.name}
        </span>
      </div>
      {isLive && score !== undefined && (
        <span className="shrink-0 text-sm font-bold text-neutral-800">
          {score}
        </span>
      )}
    </div>
  );
}