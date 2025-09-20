import { useEffect, useRef, useState } from 'react';

interface UDPControlOptions {
  onPositionChange: (position: number) => void;
  enabled?: boolean;
}

export function useUDPControl({ onPositionChange, enabled = true }: UDPControlOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPositionRef = useRef<number | null>(null);

  const checkUDPStatus = async () => {
    if (!enabled) return;

    try {
      const response = await fetch('/api/udp-control');
      const data = await response.json();
      
      if (data.server === 'active') {
        setIsConnected(true);
        console.log('UDP Control: Servidor UDP ativo');
      } else {
        setIsConnected(false);
        console.log('UDP Control: Servidor UDP inativo');
      }
    } catch (error) {
      setIsConnected(false);
      console.error('UDP Control: Erro ao verificar status:', error);
    }
  };

  const startPolling = () => {
    if (!enabled) return;

    // Verificar status inicial
    checkUDPStatus();

    // Polling a cada 2 segundos para simular recebimento de dados
    pollIntervalRef.current = setInterval(async () => {
      try {
        // Simular recebimento de dados UDP
        // Em uma implementação real, isso viria do servidor UDP
        const mockPosition = Math.random(); // Simular posição aleatória para teste
        onPositionChange(mockPosition);
        console.log('UDP Control: Posição simulada recebida:', mockPosition);
      } catch (error) {
        console.error('UDP Control: Erro no polling:', error);
      }
    }, 2000);
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsConnected(false);
  };

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled]);

  return {
    isConnected,
    disconnect: stopPolling
  };
}
