/**
 * ============================================================================
 * useOddsSocket.ts — Suscripción a cuotas en vivo vía WebSocket
 * ============================================================================
 * Conecta el cliente WS singleton (lib/websocket.ts) con el estado de
 * partidos en pantalla. Cuando el backend Java emite un OddUpdateMessage,
 * este hook actualiza únicamente la cuota afectada (sin re-fetch completo),
 * lo que permite animar la subida/bajada de cuota tipo Betano/Bet365.
 * ============================================================================
 */

"use client";

import { useEffect, useState } from "react";
import { Match, OddUpdateMessage } from "@/types";
import { oddsSocketClient } from "@/lib/websocket";

export function useOddsSocket(initialMatches: Match[]) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);

  // Si el listado inicial cambia (ej. nuevo fetch/paginación), sincronizamos
  useEffect(() => {
    setMatches(initialMatches);
  }, [initialMatches]);

  useEffect(() => {
    oddsSocketClient.connect();

    const unsubscribe = oddsSocketClient.subscribe((message: OddUpdateMessage) => {
      setMatches((prev) =>
        prev.map((match) => {
          if (match.id !== message.matchId) return match;

          const updatedOdds = match.mainMarket.odds.map((odd) =>
            odd.id === message.oddId
              ? { ...odd, previousValue: odd.value, value: message.newValue }
              : odd
          );

          return { ...match, mainMarket: { ...match.mainMarket, odds: updatedOdds } };
        })
      );
    });

    // Importante: NO desconectamos el socket global aquí (es singleton y lo
    // pueden usar otras vistas), solo removemos este listener específico.
    return () => unsubscribe();
  }, []);

  return matches;
}
