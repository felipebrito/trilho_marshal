const WebSocket = require('ws');
const dgram = require('dgram');

// Servidor WebSocket
const wss = new WebSocket.Server({ port: 8081 });
console.log('WebSocket server running on port 8081');

// Servidor UDP
const udpServer = dgram.createSocket('udp4');
let lastPosition = null;

// Clientes WebSocket conectados
const clients = new Set();

// Função para enviar dados para todos os clientes WebSocket
function broadcastToClients(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// WebSocket: Nova conexão
wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');
  clients.add(ws);
  
  // Enviar última posição se existir
  if (lastPosition !== null) {
    ws.send(JSON.stringify({
      type: 'position',
      value: lastPosition,
      timestamp: Date.now()
    }));
  }
  
  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('Erro WebSocket:', error);
    clients.delete(ws);
  });
});

// UDP: Processar mensagens
udpServer.on('message', (msg, rinfo) => {
  try {
    const data = msg.toString().trim();
    console.log('📡 UDP recebido de', rinfo.address + ':' + rinfo.port, '→', JSON.stringify(data));
    
    // Extrair número da string
    const numberMatch = data.match(/(\d+\.?\d*)/);
    const position = numberMatch ? parseFloat(numberMatch[1]) : parseFloat(data);
    
    console.log('🔢 Número extraído:', position);
    
    // Validar se está entre 0 e 1
    if (isNaN(position) || position < 0 || position > 1) {
      console.log('❌ Posição inválida:', data, '(deve ser entre 0 e 1)');
      return;
    }

    console.log('✅ Posição válida:', position);
    
    // Salvar última posição
    lastPosition = position;
    
    // Enviar para todos os clientes WebSocket
    const message = {
      type: 'position',
      value: position,
      timestamp: Date.now()
    };
    
    console.log('📤 Enviando para', clients.size, 'clientes WebSocket:', message);
    broadcastToClients(message);

  } catch (error) {
    console.error('❌ Erro ao processar UDP:', error);
  }
});

udpServer.on('error', (err) => {
  console.error('Erro servidor UDP:', err);
});

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log('Servidor UDP escutando na porta 8888', address);
});

// Iniciar servidor UDP
udpServer.bind(8888, () => {
  console.log('Servidor UDP escutando na porta 8888');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Encerrando servidores...');
  udpServer.close();
  wss.close();
  process.exit(0);
});
