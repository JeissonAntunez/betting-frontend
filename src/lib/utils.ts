import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Agrega esta función aquí abajo:
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", { // Reemplaza "es-PE" por tu región si prefieres otra moneda (ej. "en-US", "es-MX")
    style: "currency",
    currency: "PEN", // Cambia por tu moneda local (ej. "USD", "MXN", "EUR")
  }).format(value)
}
// AGREGA ESTA NUEVA FUNCIÓN PARA LAS CUOTAS:
export function formatOdd(value: number): string {
  // Asegura que la cuota siempre muestre exactamente 2 decimales (ej: 1.5 -> "1.50")
  return value.toFixed(2);
}