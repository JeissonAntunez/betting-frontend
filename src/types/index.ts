/**
 * ============================================================================
 * TYPES — Contrato de datos entre Frontend (Next.js) y Backend (Java/Spring)
 * ============================================================================
 * TIP PARA EL BACKEND (Java):
 * Estas interfaces deben reflejar 1:1 los DTOs que expone tu backend Java
 * (ej. MatchDTO.java, OddDTO.java, BetDTO.java). Si usas Spring Boot + Jackson,
 * asegúrate de que los nombres de campos coincidan (camelCase) o configura
 * @JsonProperty para mapear snake_case -> camelCase si tu DB usa snake_case.
 *
 * Recomendación: generar estos tipos automáticamente desde el contrato OpenAPI
 * de Spring (springdoc-openapi) usando `openapi-typescript` para evitar
 * desincronización entre frontend y backend a futuro.
 * ============================================================================
 */

// Estado posible de un partido (debe coincidir con el Enum de Java: MatchStatus)
export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "SUSPENDED";

// Tipo de mercado de apuesta (1X2, Over/Under, etc.)
export type MarketType = "MATCH_WINNER" | "OVER_UNDER" | "BOTH_TEAMS_SCORE" | "HANDICAP";

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  flagUrl?: string; // URL del escudo/bandera, servida por el backend o un CDN
}

export interface Odd {
  id: string;
  label: "1" | "X" | "2" | string; // "1" local, "X" empate, "2" visitante (o etiquetas custom)
  value: number; // cuota decimal, ej. 4.20
  marketType: MarketType;
  /**
   * `previousValue` se usa en el frontend para animar subida/bajada de cuota
   * (flecha verde/roja). El backend NO necesita enviarlo: se calcula
   * client-side comparando el valor anterior recibido por WebSocket.
   */
  previousValue?: number;
}

export interface Market {
  id: string;
  type: MarketType;
  name: string; // ej. "Resultado del Partido", "Goles Más/Menos 1.5"
  odds: Odd[];
}

export interface Match {
  id: string;
  tournament: string; // ej. "Mundial - Partidos"
  homeTeam: Team;
  awayTeam: Team;
  startTime: string; // ISO 8601 — el backend Java debe enviar Instant/OffsetDateTime serializado a ISO
  status: MatchStatus;
  // Minuto/marcador en vivo (solo relevante si status === "LIVE")
  liveMinute?: string; // ej. "98:19" o "Tiempo Extra"
  homeScore?: number;
  awayScore?: number;
  // Mercado principal mostrado en la card (1X2). Mercados adicionales se
  // cargan en el detalle del partido (GET /matches/{id}/markets)
  mainMarket: Market;
  isBoosted?: boolean; // bandera para mostrar badge "BB BOOST" / "SUPLENTE DE ORO"
  boostLabel?: string; // ej. "25%", "20%"
}

// Selección individual dentro del carrito de apuestas (BetSlip)
export interface BetSlipSelection {
  matchId: string;
  matchLabel: string; // "Países Bajos vs Marruecos" (para mostrar en UI sin re-fetch)
  marketName: string;
  oddId: string;
  oddLabel: string;
  oddValue: number;
}

export type BetType = "SIMPLE" | "COMBINADA" | "SISTEMA";

export interface BetRequest {
  // Payload enviado a POST /api/bets — debe mapear a BetRequestDTO en Java
  type: BetType;
  stake: number; // monto apostado
  selections: { oddId: string; value: number }[];
}

export interface BetResponse {
  id: string;
  potentialWin: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number; // saldo disponible, en la moneda local (S/ soles)
}

// Mensaje recibido por WebSocket cuando cambia una cuota en vivo.
// El backend Java (Spring WebSocket / STOMP) debe emitir este shape
// cada vez que una cuota se actualiza.
export interface OddUpdateMessage {
  matchId: string;
  oddId: string;
  newValue: number;
  timestamp: string;
}
