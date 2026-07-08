/**
 * ============================================================================
 * useBetSlip.ts — Hook de conveniencia sobre betSlipStore + envío al backend
 * ============================================================================
 */

"use client";

import { useState } from "react";
import { useBetSlipStore } from "@/store/betSlipStore";
import { useAuthStore } from "@/store/authStore";
import { placeBet } from "@/services/betService";
import { BetRequest } from "@/types";

export function useBetSlip() {
  const store = useBetSlipStore();
  const token = useAuthStore((s) => s.token);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function confirmBet() {
    if (!token) {
      setSubmitError("Debes iniciar sesión para apostar");
      return null;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: BetRequest = {
      type: store.betType,
      stake: store.stake,
      selections: store.selections.map((s) => ({ oddId: s.oddId, value: s.oddValue })),
    };

    try {
      // -> POST /api/bets en el backend Java. Ver betService.ts para el
      // manejo del caso "la cuota cambió" (HTTP 409).
      const response = await placeBet(payload, token);
      store.clear();
      return response;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al apostar");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { ...store, confirmBet, isSubmitting, submitError };
}
