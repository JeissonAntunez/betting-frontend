import { BetSlip } from "@/components/betslip/BetSlip";

// Ruta usada solo en mobile/tablet, donde el BetSlip no se muestra como
// panel lateral (ver (main)/layout.tsx, oculto bajo `xl:block`).
export default function BetSlipPage() {
  return (
    <div className="mx-auto max-w-md">
      <BetSlip />
    </div>
  );
}
