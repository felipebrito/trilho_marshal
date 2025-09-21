# Modo Kiosk para Trilho Marshal

Este documento explica como configurar e usar o Trilho Marshal em modo kiosk no Windows, ideal para quiosques, displays públicos e ambientes onde você não quer que os usuários saiam da aplicação.

## 🚀 Início Rápido - Modo Kiosk

### Opção 1: Script Interativo
```bash
# Execute o script principal e escolha a opção 2
start.bat
# Escolha: [2] Modo kiosk (Chrome em tela cheia)
```

### Opção 2: Script Direto
```bash
# Execute diretamente o modo kiosk
start-kiosk.bat
```

### Opção 3: Via npm
```bash
# Usando npm scripts
npm run start-kiosk
```

## 🔧 Configuração Avançada do Sistema

Para uma experiência de kiosk mais robusta, execute a configuração do sistema:

```bash
# Configurar sistema para modo kiosk
npm run setup-kiosk
```

**O que este script faz:**
- Desabilita gestos do touchpad
- Desabilita zoom com Ctrl+scroll
- Desabilita atalhos de teclado perigosos (Alt+Tab, Win+Tab, etc.)
- Desabilita Ctrl+Alt+Del (requer privilégios de administrador)
- Configura Chrome para não mostrar barras de ferramentas
- Desabilita notificações do Windows
- Configura para iniciar automaticamente com Windows

### Reverter Configurações
```bash
# Reverter todas as configurações de kiosk
npm run revert-kiosk
```

## 🖥️ Características do Modo Kiosk

### Chrome em Modo Kiosk
- **Tela cheia**: Aplicação ocupa toda a tela
- **Sem barras de ferramentas**: Chrome sem barra de endereço, favoritos, etc.
- **Sem gestos**: Desabilita pinch, zoom, arrastar
- **Sem atalhos**: Desabilita F11, Ctrl+T, Alt+F4, etc.
- **Sem navegação**: Usuário não pode navegar para outras páginas

### Parâmetros do Chrome Utilizados
```
--kiosk                           # Modo kiosk (tela cheia)
--disable-gesture-typing          # Desabilita gestos de digitação
--disable-pinch                   # Desabilita zoom com pinch
--disable-touch-drag-drop         # Desabilita arrastar e soltar
--disable-web-security            # Desabilita verificações de segurança
--disable-features=TranslateUI    # Desabilita tradução automática
--disable-ipc-flooding-protection # Desabilita proteção contra flood
--disable-background-timer-throttling # Desabilita throttling de timers
--disable-backgrounding-occluded-windows # Desabilita backgrounding
--disable-renderer-backgrounding  # Desabilita backgrounding do renderer
--disable-field-trial-config      # Desabilita testes de campo
--disable-back-forward-cache      # Desabilita cache de navegação
--disable-hang-monitor            # Desabilita monitor de travamento
--disable-prompt-on-repost        # Desabilita prompt de reenvio
--disable-sync                    # Desabilita sincronização
--disable-default-apps            # Desabilita aplicativos padrão
--disable-extensions              # Desabilita extensões
--no-first-run                   # Pula primeira execução
--no-default-browser-check       # Pula verificação de navegador padrão
--disable-logging                 # Desabilita logs
--silent-debugger-extension-api  # Silencia API de debug
--disable-dev-shm-usage          # Desabilita uso de /dev/shm
--disable-gpu-sandbox            # Desabilita sandbox da GPU
--disable-software-rasterizer    # Desabilita rasterizador de software
--disable-background-networking  # Desabilita rede em background
--disable-translate               # Desabilita tradução
--hide-scrollbars                # Esconde barras de rolagem
--mute-audio                     # Silencia áudio
--no-sandbox                     # Desabilita sandbox
--disable-web-security           # Desabilita segurança web
--user-data-dir="%TEMP%\chrome-kiosk" # Diretório temporário para dados
```

## 🛡️ Segurança e Controles

### Como Sair do Modo Kiosk
- **Alt+F4**: Fecha o Chrome (se não desabilitado)
- **Ctrl+Alt+Delete**: Abre o Gerenciador de Tarefas (se não desabilitado)
- **Fechar a janela do script**: Para os servidores backend

### Controles da Aplicação
- **C**: Alternar entre modo calibração e operação
- **R**: Reset para posição ideal
- **O/P**: Movimento horizontal
- **U**: Ativar/desativar controle UDP
- **T**: Travar/destravar background
- **S**: Salvar configurações
- **B**: Abrir configurador de bullets

## 📋 Requisitos

### Software
- **Windows 10/11**: Sistema operacional suportado
- **Google Chrome**: Navegador necessário para modo kiosk
- **Node.js**: Para executar os servidores backend
- **npm**: Para gerenciar dependências

### Hardware
- **Touchpad/Mouse**: Para navegação (gestos desabilitados)
- **Teclado**: Para controles da aplicação
- **Tela**: Resolução mínima recomendada 1024x768

## 🔍 Solução de Problemas

### Chrome não abre em modo kiosk
```bash
# Verificar se o Chrome está instalado
where chrome
where chrome.exe

# Verificar se a aplicação está rodando
curl http://localhost:3000
```

### Aplicação não carrega
```bash
# Verificar se os servidores estão rodando
netstat -an | findstr :3000
netstat -an | findstr :8081
netstat -an | findstr :8888
```

### Usuário consegue sair do modo kiosk
- Execute `setup-kiosk.bat` como administrador
- Reinicie o computador após a configuração
- Verifique se o Chrome está sendo executado com todos os parâmetros

### Performance lenta
- Feche outros aplicativos desnecessários
- Verifique se há atualizações do Windows pendentes
- Reinicie o computador periodicamente

## 🚀 Deploy em Produção

### 1. Preparar o Sistema
```bash
# Instalar dependências e criar build
npm run install-prod

# Configurar sistema para kiosk
npm run setup-kiosk
```

### 2. Configurar Inicialização Automática
O script `setup-kiosk.bat` já configura a inicialização automática, mas você pode verificar:

```bash
# Verificar se o atalho foi criado
dir "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\TrilhoMarshal-Kiosk.bat"
```

### 3. Testar o Sistema
```bash
# Reiniciar o computador e verificar se inicia automaticamente
# Ou executar manualmente para teste
npm run start-kiosk
```

## 📱 Configurações Adicionais

### Para Tablets/Dispositivos Touch
- O modo kiosk já desabilita gestos de touch
- Configure a orientação da tela no Windows
- Considere usar um teclado físico para controles

### Para Monitores Múltiplos
- Configure o Chrome para abrir em um monitor específico
- Use `--window-position=x,y` para posicionar a janela
- Configure `--window-size=width,height` para o tamanho desejado

### Para Ambientes Corporativos
- Configure políticas de grupo para desabilitar atalhos
- Use um usuário limitado sem privilégios administrativos
- Configure firewall para bloquear acesso à internet (exceto localhost)

## 🔄 Manutenção

### Atualizações
```bash
# Atualizar dependências
npm update

# Recriar build de produção
npm run build-prod

# Reiniciar em modo kiosk
npm run start-kiosk
```

### Logs e Monitoramento
- Os logs aparecem na janela do script
- Use `Ctrl+C` para parar os serviços
- Monitore o uso de CPU e memória

### Backup
- Faça backup do diretório `data/` regularmente
- Mantenha uma cópia dos scripts de configuração
- Documente qualquer personalização feita

---

**Desenvolvido para ambientes de produção e quiosques públicos**
