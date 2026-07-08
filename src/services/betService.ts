/**
 * ============================================================================
 * betService.ts — Envío de apuestas al backend Java
 * ============================================================================
 * TIPS BACKEND:
 * 1. Endpoint sugerido en Spring:
 *      @PostMapping("/api/bets")
 *      public BetResponseDTO placeBet(@Valid @RequestBody BetRequestDTO dto, Principal user)
 * 2. Valida en el backend (NUNCA confíes solo en el frontend):
 *    - Que las cuotas (oddId + value) sigan vigentes (no hayan cambiado desde
 *      que el usuario las vio). Si cambiaron, responde 409 Conflict con la
 *      nueva cuota para que el frontend pida confirmación al usuario
 *      ("Las cuotas cambiaron, ¿aceptas la nueva cuota?").
 *    - Que el usuario tenga saldo suficiente (transacción atómica con el
 *      módulo de wallet/balance).
 * 3. Usa @Transactional en el service de Java para evitar condiciones de
 *    carrera entre validación de saldo y descuento del mismo.
 * 4. El header Authorization (JWT) se adjunta automáticamente si usas
 *    NextAuth + un interceptor, o pásalo manualmente como se ve abajo.
 * ============================================================================
 */

import { BetRequest, BetResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export async function placeBet(payload: BetRequest, token: string): Promise<BetResponse> {
  const res = await fetch(`${API_URL}/bets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // El JWT debe ser emitido por el backend Java (Spring Security + JWT)
      // en el login y guardado en authStore / cookie httpOnly.
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 409) {
    // Cuota cambió: el backend debería devolver el detalle en el body
    const conflict = await res.json();
    throw new Error(`ODDS_CHANGED:${JSON.stringify(conflict)}`);
  }

  if (!res.ok) {
    throw new Error(`Error al registrar la apuesta: ${res.status}`);
  }

  return res.json();
}

/**
 * GET /api/bets/me — historial de apuestas del usuario autenticado
 * Usado en la sección "Mis Apuestas" (Abiertas / Resueltas)
 */
export async function getMyBets(token: string): Promise<BetResponse[]> {
  const res = await fetch(`${API_URL}/bets/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error al obtener tus apuestas");
  return res.json();
}
