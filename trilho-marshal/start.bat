@echo off
REM Script de inicialização para Trilho Marshal (Windows)
REM Executa o servidor WebSocket e a aplicação Next.js simultaneamente

echo 🚀 Iniciando Trilho Marshal...
echo 📡 Servidor WebSocket: porta 8081
echo 🌐 Aplicação Next.js: porta 3000
echo 📡 Servidor UDP: porta 8888
echo.

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
    echo.
)

REM Verificar se o arquivo websocket-server.js existe
if not exist "websocket-server.js" (
    echo ❌ Arquivo websocket-server.js não encontrado!
    echo    Certifique-se de estar no diretório correto.
    pause
    exit /b 1
)

echo ✅ Iniciando servidores...
echo    Pressione Ctrl+C para parar todos os serviços
echo.

REM Executar servidor WebSocket e aplicação Next.js simultaneamente
npx concurrently --names "WebSocket,UDP,Next.js" --prefix-colors "cyan,magenta,green" "node websocket-server.js" "node lib/udp-server.js" "npm run dev"
