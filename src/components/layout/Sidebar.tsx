import Link from "next/link";
import { Trophy, Star, Gamepad2, Smartphone } from "lucide-react";

const MENU = [
  { label: "Programación de Apuestas", href: "/schedule", icon: Trophy },
  { label: "Apuestas por los Campeones", href: "/champions", icon: Trophy },
  { label: "Apuestas especiales", href: "/special", icon: Star },
  { label: "Los favoritos", href: "/favorites", icon: Star },
  { label: "Virtuales", href: "/virtuales", icon: Gamepad2 },
  { label: "iOS y Android", href: "/app", icon: Smartphone },
];

/**
 * Sidebar izquierdo. Se oculta por completo en mobile (< lg) y reaparece en
 * desktop como columna fija. En mobile, esta navegación se reemplazaría por
 * el drawer del Navbar (mismo `MENU`, reutilizable si se requiere).
 */
export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-neutral-100 bg-green-500 lg:block">
      <nav className="flex flex-col py-2">
        {MENU.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <Icon size={18} className="text-neutral-400" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
