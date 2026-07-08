"use client";

import { useBetSlip } from "@/hooks/useBetSlip";
import { BetSlipItem } from "./BetSlipItem";
import { formatCurrency } from "@/lib/utils";

const QUICK_AMOUNTS = [
  ["S/30 - S/200", 30],
  ["S/200 - S/600", 200],
  ["S/600 - S/3000", 600],
  ["S/3000 - S/20000", 3000],
] as const;

/**
 * Carrito de apuestas (BetSlip). Vive como panel lateral en desktop
 * (ver layout (main)/layout.tsx) y como página completa en mobile
 * (/betslip), reutilizando el mismo componente.
 */
export function BetSlip() {
  const { selections, stake, setStake, confirmBet, isSubmitting, submitError, potentialWin } =
    useBetSlip();

  const isEmpty = selections.length === 0;

  return (
    <aside className="flex h-full w-full flex-col rounded-lg border border-neutral-200 bg-green-500">
      <header className="border-b border-neutral-100 px-4 py-3">
        <h2 className="text-sm font-bold uppercase text-neutral-700">Mis Apuestas</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-4">
        {isEmpty ? (
          <p className="py-6 text-center text-sm text-neutral-400">
            No tienes apuestas abiertas en este momento.
          </p>
        ) : (
          selections.map((selection) => (
            <BetSlipItem key={selection.oddId} selection={selection} />
          ))
        )}
      </div>

      {!isEmpty && (
        <div className="space-y-3 border-t border-neutral-100 p-4">
          <label className="block text-xs font-medium text-neutral-500">
            Selecciona el monto que deseas apostar
            <input
              type="number"
              min={1}
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm font-semibold"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            {QUICK_AMOUNTS.map(([label, amount]) => (
              <button
                key={label}
                onClick={() => setStake(amount)}
                className="rounded-md border border-neutral-200 px-2 py-2 text-[11px] font-semibold text-neutral-600 hover:border-[#FF5800]"
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-sm text-neutral-600">
            Ganancia potencial:{" "}
            <span className="font-bold text-neutral-900">{formatCurrency(potentialWin())}</span>
          </p>

          {submitError && <p className="text-xs text-red-500">{submitError}</p>}

          <button
            onClick={confirmBet}
            disabled={isSubmitting}
            className="w-full rounded-md bg-[#FF5800] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Procesando..." : "Confirmar apuesta"}
          </button>
        </div>
      )}
    </aside>
  );
}
