# 🚀 Instalação Rápida - Trilho Marshal

## Instalação em 3 Passos

### 1. Clonar e Instalar
```bash
git clone https://github.com/felipebrito/trilho_marshal.git
cd trilho_marshal/trilho-marshal
npm install
```

### 2. Executar
```bash
npm run dev
```

### 3. Acessar
- Abra: http://localhost:3000
- Pressione **C** para modo calibração
- Ajuste a posição e clique **"Salvar Posições"**

## Controles Básicos

- **C**: Alternar modos
- **R**: Reset posição ideal  
- **O/P**: Movimento horizontal
- **Scroll**: Navegação horizontal

## Controle UDP (Opcional)

```bash
# Terminal separado
npm run udp-server
```

Envie valores 0-1 para porta 8888 (só em modo operação).

## Estrutura de Imagens

```
public/
├── bg300x200-comtv.jpg    # Imagem de fundo
├── 00_bg.png             # Imagens de animação
├── 01_ano.png
├── 02_texto.png
└── imagens/              # Pastas dos bullets
    ├── 1966/
    ├── 1989/
    └── ...
```

## Solução de Problemas

- **Porta ocupada**: Aplicação usa próxima porta disponível
- **Dependências**: `rm -rf node_modules && npm install`
- **Reset completo**: Botão "Limpar Tudo" no painel

---
**Pronto! Aplicação funcionando em http://localhost:3000** 🎯
