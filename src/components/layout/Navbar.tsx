"use client";

import Link from "next/link";
import { Search, Settings, Gift, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Apuestas Deportivas", href: "/" },
  { label: "Apuestas en Vivo", href: "/live" },
  { label: "Casino", href: "/casino" },
  { label: "Casino en Vivo", href: "/casino-en-vivo" },
  { label: "Virtuales", href: "/virtuales" },
];

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FF5800] text-white">
      {/* Barra principal */}
      <div className="flex h-12 items-center gap-3 px-3 sm:px-4 lg:px-6">
        
        {/* Hamburguesa — solo móvil */}
        <button
          className="flex-shrink-0 lg:hidden"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 text-lg font-extrabold tracking-tight sm:text-xl">
          Betano
        </Link>

        {/* Nav desktop */}
        <nav className="ml-4 hidden gap-5 text-xs font-bold lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap opacity-90 hover:opacity-100"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* Acciones — derecha */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Iconos: ocultos en móvil excepto search */}
          <Search size={18} className="cursor-pointer opacity-90 hover:opacity-100" />
          <Gift size={18} className="hidden sm:block cursor-pointer opacity-90 hover:opacity-100" />
          <Settings size={18} className="hidden sm:block cursor-pointer opacity-90 hover:opacity-100" />

          {user ? (
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold sm:text-sm">
              {formatCurrency(user.balance)}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/register"
                className="hidden rounded border border-white/80 px-3 py-1 text-xs font-bold transition-opacity hover:opacity-90 sm:block"
              >
                REGISTRO
              </Link>
              <Link
                href="/login"
                className="rounded bg-[#0C8C44] px-3 py-1 text-xs font-bold transition-opacity hover:opacity-90 sm:px-4 sm:text-sm"
              >
                INGRESAR
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <nav className="border-t border-white/10 bg-[#e64f00] px-4 pb-2 pt-1 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center py-2.5 text-sm font-semibold border-b border-white/10 last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {/* En móvil, registro también aparece en el menú */}
          {!user && (
            <Link
              href="/register"
              className="mt-2 flex items-center py-2.5 text-sm font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              REGISTRO
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}