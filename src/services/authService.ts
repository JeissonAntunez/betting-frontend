/**
 * ============================================================================
 * authService.ts — Login / Registro contra el backend Java (Spring Security)
 * ============================================================================
 * TIPS BACKEND:
 * 1. Endpoints sugeridos:
 *      POST /api/auth/login    -> { token, user }
 *      POST /api/auth/register -> { token, user }
 * 2. Usa Spring Security + JWT (jjwt o nimbus-jose-jwt). El token debe
 *    incluir el userId y expirar en un tiempo razonable (ej. 1h) con
 *    soporte de refresh token si lo necesitas.
 * 3. Nunca devuelvas la contraseña ni el hash en el DTO de respuesta.
 * 4. Considera usar NextAuth.js con un "Credentials Provider" que internamente
 *    llame a este mismo endpoint Java, así Next.js maneja cookies de sesión
 *    httpOnly en vez de guardar el JWT en localStorage (más seguro contra XSS).
 * ============================================================================
 */

import { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

interface AuthResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Credenciales inválidas");
  return res.json();
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) throw new Error("No se pudo completar el registro");
  return res.json();
}
