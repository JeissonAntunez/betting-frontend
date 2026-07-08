/**
 * ============================================================================
 * matchService.ts — Capa de comunicación con el backend Java (Spring Boot)
 * ============================================================================
 * TIPS BACKEND:
 * 1. Define en Java un controlador REST equivalente:
 *      @RestController
 *      @RequestMapping("/api/matches")
 *      class MatchController {
 *          @GetMapping public List<MatchDTO> getMatches(...) {}
 *          @GetMapping("/{id}") public MatchDTO getMatch(@PathVariable String id) {}
 *      }
 * 2. Usa paginación (Pageable de Spring Data) si la lista de partidos crece;
 *    aquí ya se dejan los query params `page` y `size` listos para eso.
 * 3. Habilita CORS en el backend para el dominio del frontend:
 *      @CrossOrigin(origins = "${FRONTEND_URL}")
 * 4. Todas las fechas deben viajar en ISO-8601 (Instant/OffsetDateTime),
 *    nunca en formato local, para evitar bugs de zona horaria.
 * ============================================================================
 */

import { Match, Market } from "@/types";
import { MOCK_MATCHES } from "@/services/mockMatches";

// La URL base se inyecta vía variable de entorno (.env.local):
// NEXT_PUBLIC_API_URL=http://localhost:8080/api
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

/**
 * FALLBACK DE DESARROLLO: si el backend Java aún no está corriendo,
 * usamos datos mock en vez de romper la página con un error 500.
 * IMPORTANTE: quita `USE_MOCK_FALLBACK` (o ponlo en false) cuando el
 * backend esté desplegado, para no esconder errores reales en producción.
 */
const USE_MOCK_FALLBACK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

interface GetMatchesParams {
  sport?: string; // "futbol" | "basquetbol" | ...
  status?: "LIVE" | "SCHEDULED";
  page?: number;
  size?: number;
}

/**
 * GET /api/matches
 * Trae el listado de partidos para la home (Popular, En Vivo, Próximos).
 * En Server Components de Next.js esto se puede llamar directamente desde
 * el server (sin exponer la URL al cliente) usando `fetch` con `cache`/`next.revalidate`.
 */
export async function getMatches(params: GetMatchesParams = {}): Promise<Match[]> {
  const query = new URLSearchParams(params as Record<string, string>).toString();

  try {
    const res = await fetch(`${API_URL}/matches?${query}`, {
      // `next.revalidate` permite ISR: revalida cada 30s sin necesidad de WebSocket
      // para datos que cambian poco (calendario de partidos no en vivo).
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`Error al obtener partidos: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    if (USE_MOCK_FALLBACK) {
      console.warn(
        "[matchService] No se pudo conectar al backend Java, usando datos mock. " +
          "Levanta el backend en " +
          API_URL +
          " o revisa NEXT_PUBLIC_API_URL en .env.local."
      );
      return MOCK_MATCHES;
    }
    throw err;
  }
}

/**
 * GET /api/matches/{id}
 * Detalle de un partido específico, usado en /match/[id]
 */
export async function getMatchById(id: string): Promise<Match> {
  try {
    const res = await fetch(`${API_URL}/matches/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Partido no encontrado: ${id}`);
    return res.json();
  } catch (err) {
    if (USE_MOCK_FALLBACK) {
  const mock = MOCK_MATCHES.find((m: Match) => m.id === id);
      if (mock) return mock;
    }
    throw err;
  }
}

/**
 * GET /api/matches/{id}/markets
 * Mercados adicionales del partido (Over/Under, hándicap, etc.)
 * Se separa del endpoint principal para no sobrecargar la respuesta de la home.
 */
export async function getMatchMarkets(matchId: string): Promise<Market[]> {
  try {
    const res = await fetch(`${API_URL}/matches/${matchId}/markets`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener mercados");
    return res.json();
  } catch (err) {
    if (USE_MOCK_FALLBACK) {
     const mock = MOCK_MATCHES.find((m: Match) => m.id === matchId);
      return mock ? [mock.mainMarket] : [];
    }
    throw err;
  }
}