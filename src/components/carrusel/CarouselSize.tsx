"use client"

import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"

// Importa el tipo real del proyecto — NO lo redefinas aquí.
// Si tu archivo @/types no exporta estos nombres exactos, ajusta el import.
import { Match, Odd } from "@/types"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// team.id ya viene como código ISO alpha-2 en minúscula (nl, fr, ar...)
// lo convertimos a emoji de bandera sin necesitar imágenes/assets
function countryCodeToFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    )
}

function formatStartTime(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  const date = d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" })
  const time = d.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return { date, time }
}

// ---------------------------------------------------------------------------
// Tarjeta individual de partido
// ---------------------------------------------------------------------------

interface MatchOddsCardProps {
  match: Match
  onSelectOdds?: (matchId: string, odd: Odd) => void
}

export function MatchOddsCard({ match, onSelectOdds }: MatchOddsCardProps) {
  // Guard: evita que la UI truene si llega un match incompleto desde el backend
  if (!match?.homeTeam || !match?.awayTeam || !match?.mainMarket) {
    console.warn("Match con datos incompletos, se omite:", match)
    return null
  }

  const { date, time } = formatStartTime(match.startTime)
  const isLive = match.status === "LIVE"

  return (
    <Card className="overflow-hidden border-0 bg-[#0f1115] text-white shadow-lg">
      {/* Header: fecha/hora o minuto en vivo + torneo */}
      <div className="flex items-center justify-between bg-[#161920] px-3 py-2">
        {isLive ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            EN VIVO · {match.liveMinute}
          </span>
        ) : (
          <span className="text-xs font-medium text-neutral-400">
            {date} · {time}
          </span>
        )}
        {match.isBoosted && (
          <Badge className="rounded-sm bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-orange-500">
            SUPERCUOTA {match.boostLabel}
          </Badge>
        )}
      </div>

      <CardContent className="space-y-3 p-3">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">
          {match.tournament}
        </p>

        <div className="space-y-1.5 text-sm font-semibold">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{countryCodeToFlagEmoji(match.homeTeam.id)}</span>
              <span>{match.homeTeam.name}</span>
            </div>
            {isLive && (
              <span className="text-neutral-300">{match.homeScore}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{countryCodeToFlagEmoji(match.awayTeam.id)}</span>
              <span>{match.awayTeam.name}</span>
            </div>
            {isLive && (
              <span className="text-neutral-300">{match.awayScore}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {match.mainMarket.odds.map((odd) => (
            <OddsButton
              key={odd.id}
              label={odd.label}
              value={odd.value}
              onClick={() => onSelectOdds?.(match.id, odd)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function OddsButton({
  label,
  value,
  onClick,
}: {
  label: string
  value: number
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center rounded-md bg-[#1c1f26] py-2 transition-colors hover:bg-[#262a33] active:scale-95"
    >
      <span className="text-xs text-neutral-400">{label}</span>
      <span className="text-sm font-bold text-emerald-400">
        {value.toFixed(2)}
      </span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Carousel que consume el array de partidos real (MOCK_MATCHES o backend)
// ---------------------------------------------------------------------------

interface MatchOddsCarouselProps {
  matches: Match[]
  onSelectOdds?: (matchId: string, odd: Odd) => void
}

export function MatchOddsCarousel({
  matches,
  onSelectOdds,
}: MatchOddsCarouselProps) {
  // Aviso en desarrollo si el service sigue devolviendo ids duplicados
  if (process.env.NODE_ENV === "development") {
    const ids = matches.map((m) => m.id)
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
    if (duplicates.length > 0) {
      console.warn(
        "MatchOddsCarousel: ids duplicados detectados en matchService:",
        duplicates
      )
    }
  }

  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent>
        {matches.map((match) => (
          <CarouselItem
            key={match.id}
            className="basis-auto"
          >
            <div className="w-[260px] p-1">
              <MatchOddsCard match={match} onSelectOdds={onSelectOdds} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}