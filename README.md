# Trilho Marshal - Instalação Interativa

Uma aplicação interativa que simula um trilho com uma TV sobre uma parede, permitindo navegação horizontal em uma imagem de fundo com bullets pulsantes clicáveis. Inclui sistema de calibração avançado, animações sequenciais, controle via UDP em tempo real e sistema de bullets configuráveis.

## ✨ Novidades da Versão Atual

- **Sistema de fechamento automático de modal** por movimento (UDP, teclas, scroll)
- **Controle UDP em tempo real** com WebSocket para máxima responsividade
- **Sistema de bullets configuráveis** com posições, tamanhos e cores personalizáveis
- **Animações sequenciais** melhoradas com transições suaves
- **Sistema de debug** visual para desenvolvimento
- **Controle de teclado** para bullets quando background travado
- **Persistência de dados** com salvamento manual
- **Modal customizado** com blur funcional ao redor
- **Tratamento de erros** robusto para carregamento de imagens
- **Fundo personalizado** (#fff1ef) para melhor contraste
- **Performance otimizada** com CSS transitions
- **Componente BulletAnimation separado** para melhor performance

## 🚀 Instalação e Execução

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com o Node.js)
- **Git** (para clonar o repositório)

### 1. Clonar o Repositório

```bash
git clone https://github.com/felipebrito/trilho_marshal.git
cd trilho_marshal/trilho-marshal
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Executar a Aplicação

#### Opção A: Execução Simples (Apenas a aplicação)
```bash
npm run dev
```

#### Opção B: Execução Completa (Recomendado)
```bash
# Linux/Mac
./start.sh

# Windows
start.bat

# Ou usando npm
npm run start-all
```

A aplicação estará disponível em:
- **Local**: http://localhost:3000
- **Rede**: http://[seu-ip]:3000

### 4. Executar Servidor WebSocket (Obrigatório para UDP)

Para controle via UDP, execute em um terminal separado:

```bash
node websocket-server.js
```

O servidor estará disponível em:
- **UDP**: Porta 8888
- **WebSocket**: Porta 8081

**Nota**: O servidor WebSocket é obrigatório para o controle UDP funcionar.

## 🎮 Controles

### Teclado
- **C**: Alternar entre modo calibração e operação
- **R**: Reset para posição ideal
- **O**: Movimento horizontal para esquerda
- **P**: Movimento horizontal para direita
- **U**: Ativar/desativar controle UDP
- **T**: Travar/destravar background
- **S**: Salvar todas as configurações
- **B**: Abrir configurador de bullets
- **ESC**: Deselecionar bullet (quando background travado)
- **Setas**: Mover bullet selecionado (quando background travado)
- **Shift + Setas**: Movimento maior do bullet
- **Page Up/Down**: Movimento vertical do bullet
- **Home/End**: Movimento horizontal do bullet

### Touchpad/Mouse
- **Scroll horizontal**: Navegação horizontal
- **Pinch (2 dedos)**: Zoom (modo calibração) / Movimento horizontal (modo operação)
- **Arrastar**: Ajuste de posição (modo calibração)

### Painel de Calibração
- **Salvar Posições**: Salva todas as configurações
- **Reset Ideal**: Volta para posição ideal
- **Limpar Tudo**: Remove todas as configurações salvas

## 🎯 Funcionalidades

### Modo Calibração
- Ajuste de escala da imagem
- Ajuste de posição horizontal
- Ajuste de offset X e Y
- Configuração de bullets (posições, tamanhos, cores)
- Grid de referência
- Controle UDP
- Configurador de bullets em tempo real

### Modo Operação
- Navegação horizontal fluida
- Bullets pulsantes clicáveis
- Animações sequenciais de imagens
- Controle via UDP (valores 0-1)
- Controle de teclado para bullets
- Background travável
- **Fechamento automático de modal** por movimento

### Bullets Interativos
- 12 pontos pulsantes configuráveis
- Cores e tamanhos personalizáveis
- Animações sequenciais ao clicar
- Carregamento de imagens de pastas específicas
- **Debug visual** com informações em tempo real
- **Tratamento de erros** para imagens não encontradas
- **Transições suaves** com fade e blur

## 📁 Estrutura de Arquivos

```
trilho-marshal/
├── app/
│   ├── page.tsx              # Página principal
│   ├── globals.css           # Estilos globais
│   └── api/
│       └── udp-control/      # API para controle UDP
│           └── route.ts
├── components/
│   ├── TVViewer.tsx          # Componente principal
│   └── FadeContent.tsx       # Componente de animações
├── hooks/
│   └── useUDPControl.ts      # Hook para controle UDP
├── public/
│   ├── bg300x200-comtv.jpg   # Imagem de fundo
│   ├── 00_bg.png            # Imagens de animação
│   ├── 01_ano.png
│   ├── 02_texto.png
│   └── imagens/              # Pastas de imagens dos bullets
│       ├── 1966/
│       ├── 1989/
│       └── ...
├── websocket-server.js       # Servidor WebSocket para UDP
├── test-udp.py              # Script de teste UDP (Python)
├── test-websocket.py        # Script de teste WebSocket
└── README.md
```

## 🔧 Configuração

### Persistência de Dados
- As configurações são salvas no `localStorage` do navegador
- **Salvamento**: Manual via botão "Salvar Posições"
- **Carregamento**: Automático na inicialização
- **Reset**: Tecla R ou botão "Reset Ideal"

### Controle UDP
- **Porta UDP**: 8888
- **Porta WebSocket**: 8081
- **Formato**: Valores de 0 a 1 (0 = esquerda, 1 = direita)
- **Modo**: Funciona apenas em modo operação
- **Ativação**: Tecla 'U' para ativar/desativar
- **Teste**: Use `python test-udp.py` para testar

### Sistema de Bullets
- **Quantidade**: 12 bullets configuráveis
- **Propriedades**: Posição X/Y, tamanho, cor
- **Configuração**: Tecla 'B' para abrir configurador
- **Controle**: Teclado quando background travado
- **Persistência**: Salva automaticamente no localStorage

### Sistema de Fechamento Automático de Modal
- **Ativação**: Automática quando modal está aberto
- **Triggers**: UDP, teclas O/P, scroll/trackpad
- **Threshold**: 1.0 (detecção sensível de movimento)
- **Comportamento**: Modal fecha imediatamente ao detectar movimento
- **Reabertura**: Manual via clique no bullet

### Imagens
- **Fundo**: `public/bg300x200-comtv.jpg`
- **Bullets**: Pastas em `public/imagens/[ano]/`
- **Formato**: PNG recomendado
- **Nomes**: `00_bg.png`, `01_ano.png`, `02_texto.png`, `03_imagem.png`

## 🐛 Solução de Problemas

### Porta 3000 em uso
```bash
# A aplicação automaticamente usará a próxima porta disponível
# Ou pare o processo que está usando a porta 3000
lsof -ti:3000 | xargs kill -9
```

### Erro de dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Problemas de persistência
- Verifique o console do navegador para logs de debug
- Use "Limpar Tudo" para resetar completamente
- Verifique se o localStorage está habilitado

### Controle UDP não funciona
- Verifique se o servidor WebSocket está rodando (`node websocket-server.js`)
- Confirme que está em modo operação (tecla C)
- Verifique se o UDP está ativado (tecla U)
- Teste com `python test-udp.py`
- Verifique os logs no console do navegador

### Bullets não se movem com teclado
- Confirme que o background está travado (tecla T)
- Clique no bullet para selecioná-lo
- Use as setas para mover
- Pressione ESC para deselecionar

### WebSocket não conecta
- **Erro**: `UDP Control: ❌ Erro WebSocket: {}`
- **Solução**: Execute o servidor WebSocket primeiro:
  ```bash
  # Terminal 1: Servidor WebSocket
  node websocket-server.js
  
  # Terminal 2: Aplicação Next.js
  npm run dev
  ```
- **Alternativa**: Use o script de inicialização:
  ```bash
  # Linux/Mac
  ./start.sh
  
  # Windows
  start.bat
  ```
- Verifique se o servidor está rodando na porta 8081
- Confirme que não há firewall bloqueando
- Verifique os logs do servidor WebSocket

### Modal sem blur
- Verifique se o navegador suporta `backdrop-filter`
- Teste em Chrome/Safari (melhor suporte)
- Verifique se não há conflitos de CSS

### Animações não funcionam
- Verifique o console para logs de debug
- Confirme se as imagens estão carregando
- Use a caixa de debug no modal para verificar o progresso

## 📝 Scripts Disponíveis

```bash
# Execução da aplicação
npm run dev              # Executar aplicação Next.js
npm run start-all        # Executar tudo (WebSocket + UDP + Next.js)
./start.sh               # Script de inicialização (Linux/Mac)
start.bat                # Script de inicialização (Windows)

# Servidores individuais
npm run websocket-server # Servidor WebSocket (porta 8081)
npm run udp-server       # Servidor UDP (porta 8888)

# Build e produção
npm run build            # Build para produção
npm run start            # Executar build de produção

# Testes
python test-udp.py       # Testar controle UDP
python test-websocket.py # Testar WebSocket

# Utilitários
npm run clean-install    # Reinstalar dependências
npm run help             # Mostrar ajuda
```

## 🎨 Personalização

### Adicionar Novos Bullets
1. Edite o array `bullets` em `TVViewer.tsx`
2. Adicione pasta correspondente em `public/imagens/`
3. Salve as configurações

### Modificar Posição Ideal
1. Edite a função `getIdealPosition()` em `TVViewer.tsx`
2. Ajuste os valores de `scale`, `offsetX`, `offsetY`, `position`

### Alterar Sensibilidade
1. Modifique `sensitivity` em `handleGlobalWheel`
2. Ajuste `step` em `handleKeyDown` para teclas O/P

### Configurar Animações
1. Edite `animationConfig` em `TVViewer.tsx`
2. Ajuste durações, delays e easing
3. Use os sliders na calibração para teste em tempo real

## 🔧 Melhorias Técnicas

### Sistema de Controle UDP em Tempo Real
- **WebSocket dedicado** para máxima responsividade
- **Bridge UDP → WebSocket** para comunicação em tempo real
- **Reconexão automática** com tratamento de erros
- **Logs detalhados** para debug e monitoramento
- **Controle de estado** para ativar/desativar UDP

### Sistema de Bullets Configuráveis
- **12 bullets personalizáveis** com posições, tamanhos e cores
- **Configurador em tempo real** com interface intuitiva
- **Controle de teclado** quando background travado
- **Persistência automática** no localStorage
- **Validação de dados** para evitar erros

### Modal Customizado
- **Substituição do shadcn Dialog** por modal HTML/CSS puro
- **Blur funcional** com `backdrop-filter` e `-webkit-backdrop-filter`
- **Performance otimizada** sem dependências externas desnecessárias

### Sistema de Debug
- **Logs detalhados** no console para desenvolvimento
- **Debug visual** com informações em tempo real no modal
- **Tratamento de erros** robusto para carregamento de imagens

### Animações Melhoradas
- **CSS transitions** em vez de GSAP para melhor performance
- **Fade e blur** suaves com transições configuráveis
- **Estados visuais** claros para cada etapa da animação

### Sistema de Fechamento Automático de Modal
- **Função `checkMovementAndCloseModal`** para detecção simples e eficaz
- **Threshold baixo (1.0)** para detecção sensível de qualquer movimento
- **Integração completa** em UDP, teclas e scroll
- **Fechamento imediato** sem delays ou timeouts
- **Performance otimizada** com refs para evitar re-renders

## 📄 Licença

Este projeto é de uso interno e educacional.

## 🤝 Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs no console do navegador
- Consulte a seção de solução de problemas
- Abra uma issue no GitHub

---

**Desenvolvido com Next.js, React, TypeScript, Tailwind CSS e GSAP**