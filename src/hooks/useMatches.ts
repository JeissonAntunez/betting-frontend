/**
 * ============================================================================
 * useMatches.ts — Fetch + cache en cliente del listado de partidos
 * ============================================================================
 * Este hook es para Client Components que necesitan refetch/filtros
 * interactivos (ej. tabs "Popular" / "En Vivo" / "Próximos"). Si la página
 * es estática o SSR puro, prefiere llamar a matchService.getMatches()
 * directamente en un Server Component (más rápido, sin loading spinner).
 * ============================================================================
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { Match } from "@/types";
import { getMatches } from "@/services/matchService";

interface UseMatchesOptions {
  sport?: string;
  status?: "LIVE" | "SCHEDULED";
}

export function useMatches(options: UseMatchesOptions = {}) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMatches(options);
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.sport, options.status]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, isLoading, error, refetch: fetchMatches };
}
