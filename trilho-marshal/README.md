# Trilho Marshal - Instalação Interativa

Uma aplicação interativa que simula um trilho com uma TV sobre uma parede, permitindo navegação horizontal em uma imagem de fundo com bullets pulsantes clicáveis.

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

```bash
npm run dev
```

A aplicação estará disponível em:
- **Local**: http://localhost:3000
- **Rede**: http://[seu-ip]:3000

### 4. Executar Servidor UDP (Opcional)

Para controle via UDP, execute em um terminal separado:

```bash
npm run udp-server
```

O servidor UDP estará disponível na porta 8888.

## 🎮 Controles

### Teclado
- **C**: Alternar entre modo calibração e operação
- **R**: Reset para posição ideal
- **O**: Movimento horizontal para esquerda
- **P**: Movimento horizontal para direita

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

### Modo Operação
- Navegação horizontal fluida
- Bullets pulsantes clicáveis
- Animações sequenciais de imagens
- Controle via UDP (valores 0-1)

### Bullets Interativos
- 12 pontos pulsantes configuráveis
- Cores e tamanhos personalizáveis
- Animações sequenciais ao clicar
- Carregamento de imagens de pastas específicas

## 📁 Estrutura de Arquivos

```
trilho-marshal/
├── app/
│   ├── page.tsx              # Página principal
│   └── globals.css           # Estilos globais
├── components/
│   └── TVViewer.tsx          # Componente principal
├── hooks/
│   └── useUDPControl.ts      # Hook para controle UDP
├── lib/
│   └── udp-server.js         # Servidor UDP
├── public/
│   ├── bg300x200-comtv.jpg   # Imagem de fundo
│   ├── 00_bg.png            # Imagens de animação
│   ├── 01_ano.png
│   ├── 02_texto.png
│   └── imagens/              # Pastas de imagens dos bullets
│       ├── 1966/
│       ├── 1989/
│       └── ...
├── scripts/
│   ├── test-udp.js           # Script de teste UDP
│   └── simple-udp-test.js    # Teste simples UDP
└── README.md
```

## 🔧 Configuração

### Persistência de Dados
- As configurações são salvas no `localStorage` do navegador
- **Salvamento**: Manual via botão "Salvar Posições"
- **Carregamento**: Automático na inicialização
- **Reset**: Tecla R ou botão "Reset Ideal"

### Controle UDP
- **Porta**: 8888
- **Formato**: Valores de 0 a 1 (0 = esquerda, 1 = direita)
- **Modo**: Funciona apenas em modo operação
- **Teste**: Use `npm run test-udp` para testar

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
- Verifique se o servidor UDP está rodando
- Confirme que está em modo operação (tecla C)
- Teste com `npm run test-udp`

## 📝 Scripts Disponíveis

```bash
npm run dev          # Executar aplicação
npm run build        # Build para produção
npm run start        # Executar build de produção
npm run udp-server   # Executar servidor UDP
npm run test-udp     # Testar controle UDP
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