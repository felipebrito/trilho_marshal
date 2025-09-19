const dgram = require('dgram');

// Criar cliente UDP
const client = dgram.createSocket('udp4');

// Função para enviar posição
function sendPosition(position) {
  const message = Buffer.from(position.toString());
  
  client.send(message, 8888, 'localhost', (err) => {
    if (err) {
      console.error('Erro ao enviar:', err);
    } else {
      console.log(`Posição enviada: ${position} (${(position * 100).toFixed(1)}%)`);
    }
  });
}

// Função para testar diferentes posições
function testPositions() {
  console.log('Testando controle UDP...');
  console.log('Enviando posições de 0 a 1 em intervalos de 0.1');
  
  let position = 0;
  const interval = setInterval(() => {
    sendPosition(position);
    position += 0.1;
    
    if (position > 1) {
      clearInterval(interval);
      console.log('Teste concluído!');
      client.close();
    }
  }, 1000);
}

// Função para controle interativo
function interactiveControl() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Controle UDP Interativo');
  console.log('Digite valores entre 0 e 1 para controlar a posição');
  console.log('Digite "test" para teste automático');
  console.log('Digite "quit" para sair');
  console.log('');

  rl.on('line', (input) => {
    if (input === 'quit') {
      rl.close();
      client.close();
      return;
    }
    
    if (input === 'test') {
      testPositions();
      return;
    }
    
    const position = parseFloat(input);
    if (isNaN(position) || position < 0 || position > 1) {
      console.log('Valor inválido! Digite um número entre 0 e 1');
      return;
    }
    
    sendPosition(position);
  });
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.includes('--test')) {
  testPositions();
} else if (args.includes('--interactive')) {
  interactiveControl();
} else {
  console.log('Uso:');
  console.log('  node test-udp.js --test        # Teste automático');
  console.log('  node test-udp.js --interactive # Controle interativo');
  console.log('  node test-udp.js 0.5           # Enviar posição específica');
  
  // Se um número foi fornecido, enviar essa posição
  const position = parseFloat(args[0]);
  if (!isNaN(position) && position >= 0 && position <= 1) {
    sendPosition(position);
    setTimeout(() => client.close(), 1000);
  } else {
    client.close();
  }
}
