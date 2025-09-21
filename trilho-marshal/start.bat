@echo off
REM Script de inicialização para Trilho Marshal (Windows) - PRODUÇÃO
REM Executa o servidor WebSocket/UDP e a aplicação Next.js em produção

echo 🚀 Iniciando Trilho Marshal (PRODUÇÃO)...
echo 📡 Servidor WebSocket: porta 8081
echo 🌐 Aplicação Next.js: porta 3000 (Produção)
echo 📡 Servidor UDP: porta 8888
echo.

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
    echo.
)

REM Verificar se o build de produção existe
if not exist ".next" (
    echo 🔨 Criando build de produção...
    npm run build
    if errorlevel 1 (
        echo ❌ Erro ao criar build de produção!
        pause
        exit /b 1
    )
    echo ✅ Build de produção criado com sucesso!
    echo.
)

REM Verificar se o arquivo websocket-server.js existe
if not exist "websocket-server.js" (
    echo ❌ Arquivo websocket-server.js não encontrado!
    echo    Certifique-se de estar no diretório correto.
    pause
    exit /b 1
)


echo ✅ Iniciando servidores em modo produção...
echo    Pressione Ctrl+C para parar todos os serviços
echo.

REM Executar servidor WebSocket/UDP e aplicação Next.js em produção simultaneamente
REM Usando apenas websocket-server.js que já inclui UDP
npx concurrently --names "WebSocket+UDP,Next.js" --prefix-colors "cyan,green" "node websocket-server.js" "npm start"
