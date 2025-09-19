import { useEffect, useRef } from 'react';

interface UDPControlOptions {
  onPositionChange: (position: number) => void;
  enabled?: boolean;
}

export function useUDPControl({ onPositionChange, enabled = true }: UDPControlOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    if (!enabled) return;

    try {
      // Conectar ao WebSocket do servidor UDP
      const ws = new WebSocket(`ws://localhost:3002/api/udp-control/ws`);
      
      ws.onopen = () => {
        console.log('UDP Control: WebSocket conectado');
        wsRef.current = ws;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'position' && typeof data.value === 'number') {
            // Converter de 0-1 para 0-100%
            const percentage = data.value * 100;
            onPositionChange(percentage);
            console.log('UDP Control: Posição recebida:', percentage + '%');
          }
        } catch (error) {
          console.error('UDP Control: Erro ao processar mensagem:', error);
        }
      };

      ws.onclose = () => {
        console.log('UDP Control: WebSocket desconectado, tentando reconectar...');
        wsRef.current = null;
        
        // Reconectar após 3 segundos
        if (enabled) {
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('UDP Control: Erro no WebSocket:', error);
      };

    } catch (error) {
      console.error('UDP Control: Erro ao conectar:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  useEffect(() => {
    if (enabled) {
      connectWebSocket();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    disconnect
  };
}
