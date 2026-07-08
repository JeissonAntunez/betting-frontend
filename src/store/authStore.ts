/**
 * ============================================================================
 * authStore.ts — Estado global de sesión del usuario
 * ============================================================================
 * El `token` se obtiene de authService.login()/register() (backend Java +
 * Spring Security JWT). Para producción, evalúa mover el token a una cookie
 * httpOnly gestionada por NextAuth en vez de Zustand+localStorage, ya que
 * localStorage es vulnerable a XSS. Se deja aquí simplificado para que el
 * flujo de datos sea explícito mientras integras el backend.
 * ============================================================================
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "betano-auth" }
  )
);
