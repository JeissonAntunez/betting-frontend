"use client";

import { useEffect, useState } from "react";
import { Odd, BetSlipSelection } from "@/types";
import { useBetSlipStore } from "@/store/betSlipStore";
import { formatOdd, cn } from "@/lib/utils";

interface OddButtonProps {
  odd: Odd;
  matchId: string;
  matchLabel: string;
  marketName: string;
  disabled?: boolean;
}

/**
 * Botón individual de cuota (ej. "1  4.20").
 * - Se pone verde/rojo brevemente cuando la cuota cambia (dato que llega
 *   por WebSocket vía useOddsSocket, propagado como `odd.previousValue`).
 * - Al hacer click, agrega/quita la selección del carrito global (Zustand).
 */
export function OddButton({ odd, matchId, matchLabel, marketName, disabled }: OddButtonProps) {
  const toggleSelection = useBetSlipStore((s) => s.toggleSelection);
  const isSelected = useBetSlipStore((s) => s.isSelected(odd.id));
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (odd.previousValue === undefined) return;
    if (odd.value > odd.previousValue) setFlash("up");
    else if (odd.value < odd.previousValue) setFlash("down");

    const timeout = setTimeout(() => setFlash(null), 1200);
    return () => clearTimeout(timeout);
  }, [odd.value, odd.previousValue]);

  const selection: BetSlipSelection = {
    matchId,
    matchLabel,
    marketName,
    oddId: odd.id,
    oddLabel: odd.label,
    oddValue: odd.value,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => toggleSelection(selection)}
      aria-pressed={isSelected}
      className={cn(
        "flex flex-1 items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
        "min-w-[88px] disabled:cursor-not-allowed disabled:opacity-50",
        isSelected
          ? "border-[#FF5800] bg-[#FF5800]/10 text-[#FF5800]"
          : "border-neutral-200 bg-white text-neutral-900 hover:border-[#FF5800]/60",
        flash === "up" && "animate-pulse bg-green-50 border-green-400 text-green-700",
        flash === "down" && "animate-pulse bg-red-50 border-red-400 text-red-700"
      )}
    >
      <span className="text-neutral-500 text-xs uppercase">{odd.label}</span>
      <span>{formatOdd(odd.value)}</span>
    </button>
  );
}
