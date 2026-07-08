/**
 * ============================================================================
 * websocket.ts — Cliente WebSocket singleton para cuotas en vivo
 * ============================================================================
 * TIPS BACKEND (Java):
 * 1. Spring Boot soporta WebSocket nativo + STOMP. Recomendación:
 *      @Configuration
 *      @EnableWebSocketMessageBroker
 *      class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
 *          registry.addEndpoint("/ws-odds").setAllowedOrigins("*").withSockJS();
 *          registry.enableSimpleBroker("/topic");
 *      }
 *    Y emite actualizaciones a un topic por partido, ej:
 *      simpMessagingTemplate.convertAndSend("/topic/odds/" + matchId, oddUpdateMessage);
 *
 * 2. Si prefieres WebSocket "puro" (sin STOMP/SockJS) para simplificar, basta
 *    con un @ServerEndpoint (Jakarta WebSocket) o un handler de Spring
 *    (WebSocketHandler) que retransmita un JSON con el shape OddUpdateMessage.
 *    Este cliente está escrito para WebSocket nativo del navegador (simple),
 *    cambia la URL/protocolo si finalmente usas STOMP (necesitarías la lib
 *    @stomp/stompjs en el frontend).
 *
 * 3. Maneja reconexión: el backend puede caerse o el usuario perder señal;
 *    este singleton reintenta con backoff exponencial automáticamente.
 * ============================================================================
 */

import { OddUpdateMessage } from "@/types";

type Listener = (message: OddUpdateMessage) => void;

class OddsWebSocketClient {
  private socket: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private reconnectAttempts = 0;
  private readonly maxReconnectDelay = 15000;
  private url: string;

  constructor() {
    // NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws-odds
    this.url = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws-odds";
  }

  connect() {
    if (this.socket && this.socket.readyState <= WebSocket.OPEN) return;

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      console.info("[ws] conectado al feed de cuotas");
    };

    this.socket.onmessage = (event) => {
      try {
        const data: OddUpdateMessage = JSON.parse(event.data);
        this.listeners.forEach((listener) => listener(data));
      } catch (err) {
        console.error("[ws] mensaje inválido", err);
      }
    };

    this.socket.onclose = () => {
      const delay = Math.min(1000 * 2 ** this.reconnectAttempts, this.maxReconnectDelay);
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), delay);
    };

    this.socket.onerror = (err) => {
      console.error("[ws] error de conexión", err);
      this.socket?.close();
    };
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

// Singleton: una sola conexión WS compartida por toda la app,
// independiente de cuántos componentes usen useOddsSocket().
export const oddsSocketClient = new OddsWebSocketClient();
