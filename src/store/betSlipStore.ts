/**
 * ============================================================================
 * betSlipStore.ts — Estado global del carrito de apuestas (Zustand)
 * ============================================================================
 * Este store vive 100% en el cliente (no toca el backend). Solo cuando el
 * usuario presiona "Confirmar apuesta" se construye un BetRequest y se
 * envía a betService.placeBet() -> POST /api/bets (backend Java).
 * ============================================================================
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BetSlipSelection, BetType } from "@/types";

interface BetSlipState {
  selections: BetSlipSelection[];
  betType: BetType;
  stake: number;

  addSelection: (selection: BetSlipSelection) => void;
  removeSelection: (oddId: string) => void;
  toggleSelection: (selection: BetSlipSelection) => void;
  setStake: (stake: number) => void;
  setBetType: (type: BetType) => void;
  clear: () => void;

  // Derivados útiles para la UI
  isSelected: (oddId: string) => boolean;
  totalOdds: () => number;
  potentialWin: () => number;
}

export const useBetSlipStore = create<BetSlipState>()(
  persist(
    (set, get) => ({
      selections: [],
      betType: "SIMPLE",
      stake: 30,

      addSelection: (selection) =>
        set((state) => {
          // Regla de negocio típica: no se permiten dos selecciones del
          // mismo partido en una combinada (el backend debería validarlo
          // también, esto es solo UX optimista).
          const filtered = state.selections.filter((s) => s.matchId !== selection.matchId);
          return { selections: [...filtered, selection] };
        }),

      removeSelection: (oddId) =>
        set((state) => ({
          selections: state.selections.filter((s) => s.oddId !== oddId),
        })),

      toggleSelection: (selection) => {
        const exists = get().selections.some((s) => s.oddId === selection.oddId);
        if (exists) {
          get().removeSelection(selection.oddId);
        } else {
          get().addSelection(selection);
        }
      },

      setStake: (stake) => set({ stake }),
      setBetType: (betType) => set({ betType }),
      clear: () => set({ selections: [], stake: 30 }),

      isSelected: (oddId) => get().selections.some((s) => s.oddId === oddId),

      totalOdds: () => get().selections.reduce((acc, s) => acc * s.oddValue, 1),

      potentialWin: () => Number((get().stake * get().totalOdds()).toFixed(2)),
    }),
    {
      name: "betano-betslip", // persiste en localStorage para no perder el carrito al recargar
    }
  )
);
