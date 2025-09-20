import { useEffect, useRef, useState } from 'react';

interface UDPControlOptions {
  onPositionChange: (position: number) => void;
  enabled?: boolean;
}

export function useUDPControl({ onPositionChange, enabled = true }: UDPControlOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPositionRef = useRef<number | null>(null);
  const enabledRef = useRef<boolean>(enabled);

  const connectWebSocket = () => {
    if (!enabled) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      console.log('UDP Control: Conectando WebSocket...');
      const ws = new WebSocket('ws://localhost:8081');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('UDP Control: ✅ WebSocket conectado');
        setIsConnected(true);
        
        // Limpar timeout de reconexão se existir
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'position' && data.value !== undefined) {
            if (data.value !== lastPositionRef.current) {
              lastPositionRef.current = data.value;
              console.log('UDP Control: 📡 Dados recebidos:', data.value);
              onPositionChange(data.value);
            }
          }
        } catch (error) {
          console.error('UDP Control: Erro ao processar mensagem:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('UDP Control: ❌ WebSocket desconectado:', event.code, event.reason);
        setIsConnected(false);
        
        // Tentar reconectar em 2 segundos se ainda estiver habilitado
        if (enabled) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('UDP Control: 🔄 Tentando reconectar...');
            connectWebSocket();
          }, 2000);
        }
      };

      ws.onerror = (error) => {
        console.error('UDP Control: ❌ Erro WebSocket:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('UDP Control: ❌ Erro ao conectar WebSocket:', error);
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    console.log('UDP Control: 🔌 Desconectando...');
    
    // Limpar timeout de reconexão
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
      console.log('UDP Control: Timeout de reconexão limpo');
    }
    
    // Fechar WebSocket
    if (wsRef.current) {
      console.log('UDP Control: Fechando WebSocket...');
      wsRef.current.close();
      wsRef.current = null;
    }
    
    // Limpar última posição
    lastPositionRef.current = null;
    
    // Atualizar estado
    setIsConnected(false);
    console.log('UDP Control: ✅ Desconectado completamente');
  };

  useEffect(() => {
    console.log('UDP Control: useEffect executado, enabled:', enabled, 'enabledRef:', enabledRef.current, 'timestamp:', new Date().toISOString());
    
    // Só reconectar se o estado realmente mudou
    if (enabled !== enabledRef.current) {
      enabledRef.current = enabled;
      
      if (enabled) {
        console.log('UDP Control: Conectando WebSocket...');
        connectWebSocket();
      } else {
        console.log('UDP Control: Desconectando WebSocket...');
        disconnect();
      }
    } else {
      console.log('UDP Control: Estado não mudou, ignorando...');
    }

    return () => {
      console.log('UDP Control: Cleanup - desconectando...');
      disconnect();
    };
  }, [enabled]);

  return {
    isConnected,
    disconnect
  };
}
