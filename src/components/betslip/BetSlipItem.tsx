"use client";

import { X } from "lucide-react";
import { BetSlipSelection } from "@/types";
import { useBetSlipStore } from "@/store/betSlipStore";
import { formatOdd } from "@/lib/utils";

export function BetSlipItem({ selection }: { selection: BetSlipSelection }) {
  const removeSelection = useBetSlipStore((s) => s.removeSelection);

  return (
    <div className="flex items-start justify-between gap-2 border-b border-neutral-100 py-3 bg-blue-500">
      <div>
        <p className="text-sm font-medium text-neutral-900">{selection.matchLabel}</p>
        <p className="text-xs text-neutral-500">
          {selection.marketName} · {selection.oddLabel}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-[#FF5800]">{formatOdd(selection.oddValue)}</span>
        <button
          aria-label="Quitar selección"
          onClick={() => removeSelection(selection.oddId)}
          className="text-neutral-400 hover:text-neutral-700"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
