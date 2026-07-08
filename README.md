# Betting Frontend (Next.js + React)

Frontend de casa de apuestas inspirado en Betano, listo para integrarse con un backend **Java (Spring Boot)**.

## Stack
- Next.js 14 (App Router) + React 18 + TypeScript
- Zustand (estado global: carrito de apuestas y sesión)
- TailwindCSS
- WebSocket nativo para cuotas en vivo

## Integración con el backend Java
1. Copia `.env.local.example` a `.env.local` y define:
   - `NEXT_PUBLIC_API_URL` → URL base del backend Spring Boot (ej. `http://localhost:8080/api`)
   - `NEXT_PUBLIC_WS_URL` → endpoint WebSocket de cuotas en vivo
2. Los contratos de datos esperados están en `src/types/index.ts`. Úsalos como
   referencia para tus DTOs de Java (mismos nombres de campo en camelCase).
3. Toda llamada HTTP está centralizada en `src/services/*` — no hagas fetch
   directo desde componentes, así el backend solo necesita mantener contratos
   estables en un solo lugar del frontend.
4. El flujo de cuotas en vivo (`useOddsSocket` + `lib/websocket.ts`) espera que
   el backend emita mensajes JSON con el shape `OddUpdateMessage` por un
   WebSocket nativo o Spring STOMP (ver comentarios en `lib/websocket.ts`).

## Desarrollo
```bash
npm install
npm run dev
```

## Mock sin backend
Mientras el backend Java no esté listo, puedes reemplazar temporalmente las
funciones en `src/services/matchService.ts` para devolver datos hardcodeados
(mismo shape de `Match`), y todo el resto del frontend (componentes, store,
hooks) seguirá funcionando sin cambios.
