@echo off
REM Script para reverter configurações de modo kiosk no Windows

echo 🔄 Revertendo configurações de modo kiosk...

REM Reabilitar gestos do touchpad
echo Reabilitando gestos do touchpad...
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v "EnableGesture" /t REG_DWORD /d 1 /f >nul 2>&1

REM Reabilitar atalhos de teclado
echo Reabilitando atalhos de teclado...
reg delete "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v "NoWinKeys" /f >nul 2>&1
reg delete "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v "NoAltTab" /f >nul 2>&1

REM Reabilitar Ctrl+Alt+Del
echo Reabilitando Ctrl+Alt+Del...
reg delete "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v "DisableTaskMgr" /f >nul 2>&1

REM Remover configurações do Chrome
echo Removendo configurações do Chrome...
reg delete "HKEY_CURRENT_USER\Software\Policies\Google\Chrome" /v "BookmarkBarEnabled" /f >nul 2>&1
reg delete "HKEY_CURRENT_USER\Software\Policies\Google\Chrome" /v "ShowHomeButton" /f >nul 2>&1
reg delete "HKEY_CURRENT_USER\Software\Policies\Google\Chrome" /v "HomepageLocation" /f >nul 2>&1

REM Reabilitar notificações do Windows
echo Reabilitando notificações do Windows...
reg delete "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Notifications\Settings" /v "NOC_GLOBAL_SETTING_ALLOW_NOTIFICATION_SOUND" /f >nul 2>&1

REM Remover da inicialização automática
echo Removendo da inicialização automática...
set startup_path=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
if exist "%startup_path%\TrilhoMarshal-Kiosk.bat" del "%startup_path%\TrilhoMarshal-Kiosk.bat"

echo.
echo ✅ Configurações revertidas com sucesso!
echo    Reinicie o computador para aplicar todas as mudanças.
echo.
pause
