import { NextRequest, NextResponse } from 'next/server';
import dgram from 'dgram';

// Servidor UDP global para reutilização
let udpServer: dgram.Socket | null = null;
let clients: Set<WebSocket> = new Set();

// Função para enviar dados para todos os clientes WebSocket conectados
function broadcastToClients(data: any) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Inicializar servidor UDP
function initUDPServer() {
  if (udpServer) return;

  udpServer = dgram.createSocket('udp4');

  udpServer.on('message', (msg, rinfo) => {
    try {
      const data = msg.toString();
      const position = parseFloat(data);
      
      // Validar se está entre 0 e 1
      if (isNaN(position) || position < 0 || position > 1) {
        console.log('UDP: Posição inválida recebida:', data);
        return;
      }

      console.log('UDP: Posição recebida:', position, 'de', rinfo.address);
      
      // Enviar para clientes WebSocket
      broadcastToClients({
        type: 'position',
        value: position,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('UDP: Erro ao processar mensagem:', error);
    }
  });

  udpServer.on('error', (err) => {
    console.error('UDP: Erro no servidor:', err);
  });

  udpServer.on('listening', () => {
    const address = udpServer?.address();
    console.log('UDP: Servidor escutando na porta 8888', address);
  });

  udpServer.bind(8888);
}

// Inicializar servidor UDP quando o módulo for carregado
initUDPServer();

export async function GET() {
  return NextResponse.json({ 
    status: 'UDP Server running on port 8888',
    clients: clients.size,
    server: udpServer ? 'active' : 'inactive'
  });
}

export async function POST(request: NextRequest) {
  try {
    const { position } = await request.json();
    
    if (typeof position !== 'number' || position < 0 || position > 1) {
      return NextResponse.json({ error: 'Position must be between 0 and 1' }, { status: 400 });
    }

    // Enviar para clientes WebSocket
    broadcastToClients({
      type: 'position',
      value: position,
      timestamp: Date.now()
    });

    return NextResponse.json({ success: true, position });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

// WebSocket para comunicação em tempo real
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ws = searchParams.get('ws');
  
  if (ws === 'true') {
    // Retornar endpoint WebSocket
    return NextResponse.json({ 
      websocket: '/api/udp-control/ws',
      instructions: 'Connect to WebSocket to receive UDP position updates'
    });
  }
  
  return NextResponse.json({ 
    status: 'UDP Server running on port 8888',
    clients: clients.size,
    server: udpServer ? 'active' : 'inactive'
  });
}
