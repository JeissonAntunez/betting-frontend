"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

// Llama a POST /api/auth/register en el backend Java
export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { user, token } = await register(username, email, password);
      setSession(user, token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar el registro");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-neutral-200 bg-white p-6"
      >
        <h1 className="text-lg font-bold text-[#FF5800]">Crear cuenta</h1>

        <input
          required
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
        />
        <input
          type="email"
          required
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-[#0C8C44] py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {isLoading ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>
    </div>
  );
}
