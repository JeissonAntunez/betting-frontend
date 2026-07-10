/**
 * ============================================================================
 * mockMatches.ts — Datos de ejemplo para desarrollar el frontend SIN backend
 * ============================================================================
 * Se usan automáticamente como fallback en matchService.ts cuando el fetch
 * al backend Java falla (ej. backend aún no levantado en local). Bórralo o
 * desactiva el fallback en matchService.ts cuando el backend esté listo.
 * ============================================================================
 */

import { Match } from "@/types";

export const MOCK_MATCHES: Match[] = [
  {
    id: "1",
    tournament: "Mundial - Partidos",
    homeTeam: { id: "nl", name: "Países Bajos" },
    awayTeam: { id: "ma", name: "Marruecos" },
    startTime: new Date().toISOString(),
    status: "LIVE",
    liveMinute: "98:19",
    homeScore: 1,
    awayScore: 1,
    isBoosted: true,
    boostLabel: "25%",
    mainMarket: {
      id: "m1",
      type: "MATCH_WINNER",
      name: "Resultado del Tiempo Extra",
      odds: [
        { id: "o1", label: "1", value: 4.2, marketType: "MATCH_WINNER" },
        { id: "o2", label: "X", value: 1.7, marketType: "MATCH_WINNER" },
        { id: "o3", label: "2", value: 4.15, marketType: "MATCH_WINNER" },
      ],
    },
  },
  {
    id: "2",
    tournament: "Mundial",
    homeTeam: { id: "fr", name: "Francia" },
    awayTeam: { id: "se", name: "Suecia" },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
    status: "SCHEDULED",
    mainMarket: {
      id: "m2",
      type: "MATCH_WINNER",
      name: "Resultado del partido",
      odds: [
        { id: "o4", label: "1", value: 1.34, marketType: "MATCH_WINNER" },
        { id: "o5", label: "X", value: 5.9, marketType: "MATCH_WINNER" },
        { id: "o6", label: "2", value: 9.5, marketType: "MATCH_WINNER" },
      ],
    },
  },
  {
    id: "3",
    tournament: "Mundial",
    homeTeam: { id: "ci", name: "Costa de Marfil" },
    awayTeam: { id: "no", name: "Noruega" },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 21).toISOString(),
    status: "SCHEDULED",
    isBoosted: true,
    boostLabel: "20%",
    mainMarket: {
      id: "m3",
      type: "MATCH_WINNER",
      name: "Resultado del partido",
      odds: [
        { id: "o7", label: "1", value: 3.6, marketType: "MATCH_WINNER" },
        { id: "o8", label: "X", value: 3.45, marketType: "MATCH_WINNER" },
        { id: "o9", label: "2", value: 2.18, marketType: "MATCH_WINNER" },
      ],
    },
  },
  {
    id: "4",
    tournament: "Mundial",
    homeTeam: { id: "de", name: "Alemania" },
    awayTeam: { id: "jp", name: "Japón" },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
    status: "SCHEDULED",
    mainMarket: {
      id: "m4",
      type: "MATCH_WINNER",
      name: "Resultado del partido",
      odds: [
        { id: "o10", label: "1", value: 1.55, marketType: "MATCH_WINNER" },
        { id: "o11", label: "X", value: 4.1, marketType: "MATCH_WINNER" },
        { id: "o12", label: "2", value: 6.2, marketType: "MATCH_WINNER" },
      ],
    },
  },
  {
    id: "5",
    tournament: "Mundial",
    homeTeam: { id: "es", name: "España" },
    awayTeam: { id: "de", name: "Alemania" },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString(),
    status: "SCHEDULED",
    isBoosted: true,
    boostLabel: "15%",
    mainMarket: {
      id: "m5",
      type: "MATCH_WINNER",
      name: "Resultado del partido",
      odds: [
        { id: "o13", label: "1", value: 2.05, marketType: "MATCH_WINNER" },
        { id: "o14", label: "X", value: 3.3, marketType: "MATCH_WINNER" },
        { id: "o15", label: "2", value: 3.1, marketType: "MATCH_WINNER" },
      ],
    },
  },
  {
    id: "6",
    tournament: "Mundial",
    homeTeam: { id: "br", name: "Brasil" },
    awayTeam: { id: "ar", name: "Argentina" },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: "SCHEDULED",
    mainMarket: {
      id: "m6",
      type: "MATCH_WINNER",
      name: "Resultado del partido",
      odds: [
        { id: "o16", label: "1", value: 2.7, marketType: "MATCH_WINNER" },
        { id: "o17", label: "X", value: 3.0, marketType: "MATCH_WINNER" },
        { id: "o18", label: "2", value: 2.5, marketType: "MATCH_WINNER" },
      ],
    },
  },
  {
    id: "7",
    tournament: "Mundial",
    homeTeam: { id: "pt", name: "Portugal" },
    awayTeam: { id: "it", name: "Italia" },
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 25).toISOString(),
    status: "SCHEDULED",
    mainMarket: {
      id: "m7",
      type: "MATCH_WINNER",
      name: "Resultado del partido",
      odds: [
        { id: "o19", label: "1", value: 2.2, marketType: "MATCH_WINNER" },
        { id: "o20", label: "X", value: 3.15, marketType: "MATCH_WINNER" },
        { id: "o21", label: "2", value: 3.3, marketType: "MATCH_WINNER" },
      ],
    },
  },
];