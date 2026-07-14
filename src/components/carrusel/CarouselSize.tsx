// components/carrusel/CarouselSize.tsx
"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import Autoplay from "embla-carousel-autoplay"
import { Match, Odd } from "@/types"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countryCodeToFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

function formatStartTime(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" }),
    time: d.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  }
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [breakpoint])

  return isMobile
}

function useSlidesToScroll(): number {
  const [slides, setSlides] = React.useState(2)

  React.useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (w >= 1280) setSlides(3)
      else if (w >= 768) setSlides(2)
      else setSlides(1)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return slides
}

// ---------------------------------------------------------------------------
// Banners móvil — reemplaza las imágenes en /public/banners/
// O pásalos como prop desde el server si vienen del backend
// ---------------------------------------------------------------------------

const MOBILE_BANNERS = [
  {
    id: "1",
    imageUrl: "/banners/banner1.jpg",
    alt: "Betano - Promotor oficial FIFA Copa Mundial",
    href: "/promo/mundial",
  },
  {
    id: "2",
    imageUrl: "/banners/banner2.jpg",
    alt: "Supercuotas especiales",
    href: "/promo/supercuotas",
  },
  {
    id: "3",
    imageUrl: "/banners/banner3.jpg",
    alt: "Casino en vivo",
    href: "/casino-en-vivo",
  },
]

// ---------------------------------------------------------------------------
// MatchOddsCard
// ---------------------------------------------------------------------------

interface MatchOddsCardProps {
  match: Match
  onSelectOdds?: (matchId: string, odd: Odd) => void
}

export function MatchOddsCard({ match, onSelectOdds }: MatchOddsCardProps) {
  if (!match?.homeTeam || !match?.awayTeam || !match?.mainMarket) {
    console.warn("MatchOddsCard: datos incompletos:", match)
    return null
  }

  const { date, time } = formatStartTime(match.startTime)
  const isLive = match.status === "LIVE"

  return (
    <Card className="h-full overflow-hidden border-0 rounded-xl ring-1 ring-neutral-800 bg-[#0f1115] text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#161920] px-3 py-2">
        {isLive ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            EN VIVO · {match.liveMinute}′
          </span>
        ) : (
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-neutral-500">{date}</span>
            <span className="text-xs font-medium text-neutral-300">{time}</span>
          </div>
        )}
        {match.isBoosted && (
          <Badge className="rounded-sm bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-orange-500">
            SUPERCUOTA {match.boostLabel}
          </Badge>
        )}
      </div>

      {/* Body */}
      <CardContent className="space-y-3 p-3">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500">
          {match.tournament}
        </p>

        <div className="space-y-1.5">
          <TeamRow
            countryCode={match.homeTeam.id}
            name={match.homeTeam.name}
            score={isLive ? match.homeScore : undefined}
          />
          <TeamRow
            countryCode={match.awayTeam.id}
            name={match.awayTeam.name}
            score={isLive ? match.awayScore : undefined}
          />
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-1">
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

function TeamRow({
  countryCode,
  name,
  score,
}: {
  countryCode: string
  name: string
  score?: number
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-base leading-none">
          {countryCodeToFlagEmoji(countryCode)}
        </span>
        <span className="truncate text-sm font-semibold">{name}</span>
      </div>
      {score !== undefined && (
        <span className="shrink-0 text-sm font-bold text-neutral-200">{score}</span>
      )}
    </div>
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
      <span className="text-[10px] text-neutral-400">{label}</span>
      <span className="text-sm font-bold text-emerald-400">{value.toFixed(2)}</span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// MÓVIL — banner con imagen, autoplay, dots, swipe
// ---------------------------------------------------------------------------

function MobileBannerCarousel() {
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<any>()

  // Autoplay: 3.5s, se pausa al tocar
  const autoplay = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => api.off("select", onSelect)
  }, [api])

  return (
    <div className="w-full bg-[#0a0d11]">
      <Carousel
        setApi={setApi}
        plugins={[autoplay.current]}
        opts={{ align: "center", loop: true }}
        className="w-full"
      >
        {/* CarouselContent de shadcn ya tiene -ml-4 interno,
            por eso usamos ml-0 para neutralizarlo */}
        <CarouselContent className="ml-0">
          {MOBILE_BANNERS.map((banner) => (
            <CarouselItem key={banner.id} className="basis-full pl-0">
              <a href={banner.href} className="block w-full">
                {/* aspect-[16/9] mantiene proporción en cualquier ancho */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.alt}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots — toca para ir a ese banner */}
      <div className="flex items-center justify-center gap-2 py-2.5">
        {MOBILE_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Banner ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-[#FF5800]" : "w-1.5 bg-neutral-600"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DESKTOP — cards de partidos, hint de la siguiente
// ---------------------------------------------------------------------------

interface CarouselInternalProps {
  matches: Match[]
  onSelectOdds?: (matchId: string, odd: Odd) => void
}

function DesktopCarousel({ matches, onSelectOdds }: CarouselInternalProps) {
  const slidesToScroll = useSlidesToScroll()

  return (
    // px-8 da espacio para que las flechas no se encimen sobre las cards
    <div className="relative w-full px-8 py-4">
      <Carousel
        opts={{ align: "start", slidesToScroll, loop: false }}
        className="w-full"
      >
        {/* 
          CarouselContent ya aplica -ml-4 internamente (ver carousel.tsx).
          Usamos gap via pl-4 en los items — no sobreescribir el ml.
        */}
        <CarouselContent>
          {matches.map((match) => (
            <CarouselItem
              key={match.id}
              // pl-4 coincide con el -ml-4 del CarouselContent
              // basis-[85%] da hint de la siguiente card en sm
              className="pl-4 basis-[85%] md:basis-1/2 xl:basis-1/3"
            >
              <div className="h-full py-1">
                <MatchOddsCard match={match} onSelectOdds={onSelectOdds} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Flechas — estilos que combinan con el fondo oscuro */}
        <CarouselPrevious className="left-1 bg-[#1c1f26] border-neutral-700 text-white hover:bg-[#262a33] hover:text-white hover:border-neutral-500" />
        <CarouselNext className="right-1 bg-[#1c1f26] border-neutral-700 text-white hover:bg-[#262a33] hover:text-white hover:border-neutral-500" />
      </Carousel>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Export principal
// ---------------------------------------------------------------------------

interface MatchOddsCarouselProps {
  matches: Match[]
  onSelectOdds?: (matchId: string, odd: Odd) => void
}

export function MatchOddsCarousel({ matches, onSelectOdds }: MatchOddsCarouselProps) {
  const isMobile = useIsMobile()

  if (process.env.NODE_ENV === "development") {
    const ids = matches.map((m) => m.id)
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    if (dupes.length) console.warn("MatchOddsCarousel: IDs duplicados:", dupes)
  }

  // Móvil → banner con imagen y autoplay
  // Desktop → cards de partidos con flechas
  return isMobile
    ? <MobileBannerCarousel />
    : <DesktopCarousel matches={matches} onSelectOdds={onSelectOdds} />
}