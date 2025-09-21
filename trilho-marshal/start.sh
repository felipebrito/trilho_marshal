#!/bin/bash

# Script de inicialização para Trilho Marshal - PRODUÇÃO
# Executa o servidor WebSocket/UDP e a aplicação Next.js em produção

echo "🚀 Iniciando Trilho Marshal (PRODUÇÃO)..."
echo "📡 Servidor WebSocket: porta 8081"
echo "🌐 Aplicação Next.js: porta 3000 (Produção)"
echo "📡 Servidor UDP: porta 8888"
echo ""

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências!"
        exit 1
    fi
    echo ""
fi

# Verificar se o build de produção existe
if [ ! -d ".next" ]; then
    echo "🔨 Criando build de produção..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao criar build de produção!"
        exit 1
    fi
    echo "✅ Build de produção criado com sucesso!"
    echo ""
fi

# Verificar se o arquivo websocket-server.js existe
if [ ! -f "websocket-server.js" ]; then
    echo "❌ Arquivo websocket-server.js não encontrado!"
    echo "   Certifique-se de estar no diretório correto."
    exit 1
fi


echo "✅ Iniciando servidores em modo produção..."
echo "   Pressione Ctrl+C para parar todos os serviços"
echo ""

# Executar servidor WebSocket/UDP e aplicação Next.js em produção simultaneamente
# Usando apenas websocket-server.js que já inclui UDP
npx concurrently \
  --names "WebSocket+UDP,Next.js" \
  --prefix-colors "cyan,green" \
  "node websocket-server.js" \
  "npm start"
