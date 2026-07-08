"use client";

import Link from "next/link";
import { Search, Settings, Gift, Menu } from "lucide-react";
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

/**
 * Navbar superior. Responsive: en mobile colapsa la navegación a un menú
 * hamburguesa y oculta el buscador/links secundarios.
 */
export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FF5800] text-white">
      <div className="flex items-center gap-4 px-4 py-3 lg:px-6">
        <button
          className="lg:hidden"
          aria-label="Abrir menú"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Menu size={22} />
        </button>

        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Betano
        </Link>

        <nav className="ml-4 hidden gap-6 text-sm font-semibold lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:opacity-90">
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Gift size={20} className="hidden sm:block" />
          <Search size={20} className="hidden sm:block" />
          <Settings size={20} className="hidden sm:block" />

          {user ? (
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">
              {formatCurrency(user.balance)}
            </span>
          ) : (
            <>
              <Link
                href="/register"
                className="hidden rounded-md border border-white px-4 py-1.5 text-sm font-bold sm:block"
              >
                REGISTRO
              </Link>
              <Link
                href="/login"
                className="rounded-md bg-[#0C8C44] px-4 py-1.5 text-sm font-bold"
              >
                INGRESAR
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menú mobile */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 bg-[#e64f00] px-4 pb-3 text-sm font-semibold lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="py-2" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
