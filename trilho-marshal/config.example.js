// Trilho Marshal - Configuração de Exemplo
// Copie este arquivo para config.js e ajuste os valores conforme necessário

module.exports = {
  // Portas
  ports: {
    app: 3000,        // Porta da aplicação Next.js
    udp: 8888,        // Porta do servidor UDP
    websocket: 8081   // Porta do WebSocket para UDP
  },

  // Configurações de imagem
  image: {
    defaultWidth: 20000,
    defaultHeight: 4000,
    backgroundPath: '/bg300x200-comtv.jpg'
  },

  // Posição ideal padrão
  idealPosition: {
    scale: 0.44,
    offsetX: -36,
    offsetY: -1504,
    position: 2.1,
    gridSize: 100,
    showGrid: false
  },

  // Sensibilidade dos controles
  sensitivity: {
    trackpad: 0.3,    // Sensibilidade do trackpad
    keyboard: 2,      // Sensibilidade das teclas O/P
    touch: 10         // Sensibilidade do touch
  },

  // Configurações dos bullets
  bullets: {
    defaultSize: 2.0,
    defaultRadius: 30,
    defaultColors: [
      '#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b',
      '#ef4444', '#06b6d4', '#84cc16', '#f97316',
      '#ec4899', '#6366f1', '#14b8a6', '#fbbf24'
    ]
  },

  // Configurações de persistência
  storage: {
    prefix: 'trilho-marshal',
    autoSave: false,  // Salvamento automático desabilitado
    version: '1.0.0'
  },

  // Configurações de debug
  debug: {
    enabled: true,
    logLevel: 'info', // 'error', 'warn', 'info', 'debug'
    showConsole: true
  }
};
