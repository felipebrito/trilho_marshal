const dgram = require('dgram');

// Criar cliente UDP
const client = dgram.createSocket('udp4');

console.log('Teste UDP Simples');
console.log('Enviando posição 0.5 para localhost:8888...');

// Enviar posição 0.5 (meio da tela)
const message = Buffer.from('0.5');
client.send(message, 8888, 'localhost', (err) => {
  if (err) {
    console.error('Erro ao enviar:', err);
  } else {
    console.log('✅ Posição 0.5 enviada com sucesso!');
  }
  
  // Fechar após 1 segundo
  setTimeout(() => {
    client.close();
    console.log('Cliente UDP fechado.');
  }, 1000);
});

// Verificar se há resposta
client.on('message', (msg, rinfo) => {
  console.log('Resposta recebida:', msg.toString());
});

client.on('error', (err) => {
  console.error('Erro no cliente UDP:', err);
});
