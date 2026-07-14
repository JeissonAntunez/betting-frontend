import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { BetSlip } from "@/components/betslip/BetSlip";
import { getMatches } from "@/services/matchService";
import { MatchOddsCarousel } from "@/components/carrusel/CarouselSize";

// app/(main)/layout.tsx
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const matches = await getMatches()

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">

          {/* overflow-hidden es crítico para que Embla no cree scroll horizontal */}
          <div className="w-full overflow-hidden bg-[#0a0d11]">
            <MatchOddsCarousel matches={matches} />
          </div>

          <div className="flex flex-1 overflow-hidden">
            <main className="min-w-0 flex-1 overflow-y-auto px-3 py-4 lg:px-6">
              {children}
            </main>

            <aside className="hidden w-[340px] shrink-0 border-l border-neutral-200 px-3 py-4 xl:block">
              <div className="sticky top-4">
                <BetSlip />
              </div>
            </aside>
          </div>

        </div>
      </div>
    </div>
  )
}