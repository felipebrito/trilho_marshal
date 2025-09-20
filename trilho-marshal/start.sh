#!/bin/bash

# Script de inicialização para Trilho Marshal
# Executa o servidor WebSocket e a aplicação Next.js simultaneamente

echo "🚀 Iniciando Trilho Marshal..."
echo "📡 Servidor WebSocket: porta 8081"
echo "🌐 Aplicação Next.js: porta 3000"
echo "📡 Servidor UDP: porta 8888"
echo ""

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Verificar se o arquivo websocket-server.js existe
if [ ! -f "websocket-server.js" ]; then
    echo "❌ Arquivo websocket-server.js não encontrado!"
    echo "   Certifique-se de estar no diretório correto."
    exit 1
fi

echo "✅ Iniciando servidores..."
echo "   Pressione Ctrl+C para parar todos os serviços"
echo ""

# Executar servidor WebSocket e aplicação Next.js simultaneamente
npx concurrently \
  --names "WebSocket,UDP,Next.js" \
  --prefix-colors "cyan,magenta,green" \
  "node websocket-server.js" \
  "node lib/udp-server.js" \
  "npm run dev"
