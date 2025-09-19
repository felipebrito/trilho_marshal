const dgram = require('dgram');
const WebSocket = require('ws');

// Servidor UDP
const udpServer = dgram.createSocket('udp4');
const wss = new WebSocket.Server({ port: 8080 });

let clients = new Set();

// WebSocket Server
wss.on('connection', (ws) => {
  console.log('UDP Control: Cliente WebSocket conectado');
  clients.add(ws);
  
  ws.on('close', () => {
    console.log('UDP Control: Cliente WebSocket desconectado');
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('UDP Control: Erro no WebSocket:', error);
    clients.delete(ws);
  });
});

// Função para enviar dados para todos os clientes WebSocket
function broadcastToClients(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Servidor UDP
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
  const address = udpServer.address();
  console.log('UDP: Servidor escutando na porta 8888', address);
});

udpServer.bind(8888);

console.log('UDP Control Server iniciado:');
console.log('- UDP Server: porta 8888');
console.log('- WebSocket Server: porta 8080');
console.log('- Envie valores entre 0 e 1 para controlar a posição');
