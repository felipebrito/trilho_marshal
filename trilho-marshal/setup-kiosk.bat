@echo off
REM Script de configuração para modo kiosk no Windows
REM Configura o sistema para funcionar melhor em modo kiosk

echo 🔧 Configurando sistema para modo kiosk...

REM Desabilitar gestos do touchpad
echo Desabilitando gestos do touchpad...
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v "EnableGesture" /t REG_DWORD /d 0 /f >nul 2>&1

REM Desabilitar zoom com Ctrl+scroll
echo Desabilitando zoom com Ctrl+scroll...
reg add "HKEY_CURRENT_USER\Control Panel\Desktop" /v "LogPixels" /t REG_DWORD /d 96 /f >nul 2>&1

REM Desabilitar atalhos de teclado perigosos
echo Desabilitando atalhos de teclado perigosos...
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v "NoWinKeys" /t REG_DWORD /d 1 /f >nul 2>&1

REM Desabilitar Alt+Tab
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v "NoAltTab" /t REG_DWORD /d 1 /f >nul 2>&1

REM Desabilitar Ctrl+Alt+Del (requer privilégios de administrador)
echo Tentando desabilitar Ctrl+Alt+Del (requer privilégios de administrador)...
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v "DisableTaskMgr" /t REG_DWORD /d 1 /f >nul 2>&1

REM Configurar Chrome para não mostrar barras de ferramentas
echo Configurando Chrome para modo kiosk...
reg add "HKEY_CURRENT_USER\Software\Policies\Google\Chrome" /v "BookmarkBarEnabled" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Policies\Google\Chrome" /v "ShowHomeButton" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Policies\Google\Chrome" /v "HomepageLocation" /t REG_SZ /d "http://localhost:3000" /f >nul 2>&1

REM Desabilitar notificações do Windows
echo Desabilitando notificações do Windows...
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Notifications\Settings" /v "NOC_GLOBAL_SETTING_ALLOW_NOTIFICATION_SOUND" /t REG_DWORD /d 0 /f >nul 2>&1

REM Configurar para iniciar automaticamente com Windows
echo Configurando para iniciar automaticamente...
set startup_path=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
if not exist "%startup_path%" mkdir "%startup_path%"
copy "%~dp0start-kiosk.bat" "%startup_path%\TrilhoMarshal-Kiosk.bat" >nul 2>&1

echo.
echo ✅ Configurações de kiosk aplicadas!
echo.
echo Para reverter as configurações, execute: setup-kiosk-revert.bat
echo.
pause
