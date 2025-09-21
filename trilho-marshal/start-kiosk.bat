@echo off
REM Script de inicialização para Trilho Marshal (Windows) - MODO KIOSK
REM Executa o servidor WebSocket/UDP e abre a aplicação em modo kiosk no Chrome

echo 🚀 Iniciando Trilho Marshal (MODO KIOSK)...
echo 📡 Servidor WebSocket: porta 8081
echo 🌐 Aplicação Next.js: porta 3000 (Produção)
echo 📡 Servidor UDP: porta 8888
echo 🖥️  Modo Kiosk: Chrome em tela cheia sem controles
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

REM Verificar se o Chrome está instalado
where chrome >nul 2>nul
if errorlevel 1 (
    where chrome.exe >nul 2>nul
    if errorlevel 1 (
        echo ❌ Chrome não encontrado!
        echo    Instale o Google Chrome para usar o modo kiosk.
        pause
        exit /b 1
    )
    set CHROME_PATH=chrome.exe
) else (
    set CHROME_PATH=chrome
)

echo ✅ Iniciando servidores e abrindo em modo kiosk...
echo    Pressione Ctrl+C para parar todos os serviços
echo.

REM Executar servidor WebSocket/UDP em background
start /B "WebSocket+UDP" node websocket-server.js

REM Aguardar um pouco para o servidor inicializar
timeout /t 3 /nobreak >nul

REM Executar aplicação Next.js em background
start /B "Next.js" npm start

REM Aguardar um pouco para a aplicação inicializar
timeout /t 5 /nobreak >nul

REM Abrir Chrome em modo kiosk
echo 🌐 Abrindo aplicação em modo kiosk...
start "" "%CHROME_PATH%" --kiosk --disable-gesture-typing --disable-pinch --disable-touch-drag-drop --disable-web-security --disable-features=TranslateUI --disable-ipc-flooding-protection --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-field-trial-config --disable-back-forward-cache --disable-hang-monitor --disable-prompt-on-repost --disable-sync --disable-default-apps --disable-extensions --no-first-run --no-default-browser-check --disable-logging --silent-debugger-extension-api --disable-dev-shm-usage --disable-gpu-sandbox --disable-software-rasterizer --disable-background-networking --disable-default-apps --disable-sync --disable-translate --hide-scrollbars --mute-audio --no-sandbox --disable-web-security --user-data-dir="%TEMP%\chrome-kiosk" http://localhost:3000

echo.
echo ✅ Aplicação iniciada em modo kiosk!
echo    Para sair do modo kiosk, pressione Alt+F4 ou Ctrl+Alt+Delete
echo    Para parar os servidores, feche esta janela ou pressione Ctrl+C
echo.

REM Manter o script rodando para que os serviços continuem ativos
:loop
timeout /t 30 /nobreak >nul
goto loop
