import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { BetSlip } from "@/components/betslip/BetSlip";
import {MatchLeeter} from "@/components/match/MatchLeeter";
import { getMatches } from "@/services/matchService";
/**
 * Layout del grupo (main): Navbar arriba + Sidebar / Contenido / BetSlip.
 * Responsive:
 * - Mobile (<lg): solo Navbar + contenido a ancho completo. El BetSlip se
 *   accede vía la ruta /betslip (ver app/(main)/betslip/page.tsx) o un
 *   botón flotante "Ver apuesta (n)" — se puede añadir luego con un store
 *   selector de `selections.length`.
 * - Desktop (>=lg): grid de 3 columnas (sidebar / contenido / betslip),
 *   igual al layout original de Betano.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="mx-auto flex w-full max-w-[2300px] flex-1">
        <Sidebar />
        <div className="bg-blue-500"></div>
        <main className="min-w-0 flex-1 px-3 py-4 lg:px-6">{children}</main>
        <div className="hidden w-[340px] shrink-0 px-3 py-4 xl:block">
          <div className="sticky top-20">
            <BetSlip />
          </div>
        </div>
        </div>
      </div>
    
  );
}
