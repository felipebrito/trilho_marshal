# Trilho Marshal - Guia de Produção

Este guia explica como preparar e executar o Trilho Marshal em ambiente de produção.

## 🚀 Início Rápido

### Windows
```bash
# Instalar dependências e criar build de produção
npm run install-prod

# Executar em produção
start.bat
```

### Linux/macOS
```bash
# Instalar dependências e criar build de produção
npm run install-prod

# Executar em produção
chmod +x start.sh
./start.sh
```

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Portas disponíveis: 3000, 8081, 8888

## 🔧 Scripts Disponíveis

### Desenvolvimento
- `npm run dev` - Executar aplicação em desenvolvimento
- `npm run start-all` - Executar tudo (WebSocket + App dev)

### Produção
- `npm run build-prod` - Criar build de produção
- `npm run start-prod` - Executar em produção
- `npm run deploy` - Build + Start produção
- `npm run install-prod` - Instalar + Build produção

### Servidores
- `npm run websocket-server` - Servidor WebSocket+UDP (porta 8081+8888)

### Testes
- `npm run test-udp` - Testar UDP

### Manutenção
- `npm run clean-install` - Reinstalar dependências
- `npm run help` - Ver todos os scripts disponíveis

## ⚙️ Configuração

1. **Copie o arquivo de configuração:**
   ```bash
   cp env.example .env.local
   ```

2. **Edite as configurações em `.env.local`:**
   - `PORT` - Porta do servidor Next.js (padrão: 3000)
   - `WEBSOCKET_PORT` - Porta do WebSocket (padrão: 8081)
   - `UDP_PORT` - Porta do UDP (padrão: 8888)
   - `HOST` - Host do servidor
   - `NEXT_PUBLIC_BASE_URL` - URL base da aplicação

## 🏗️ Build de Produção

O build de produção inclui:
- ✅ Otimização de código
- ✅ Compressão gzip
- ✅ Otimização de imagens (WebP, AVIF)
- ✅ Headers de segurança
- ✅ Output standalone para containers

## 🌐 Deploy

### Deploy Local
```bash
npm run deploy
```

### Deploy em Container
O projeto está configurado com `output: 'standalone'` para facilitar deploy em containers Docker.

### Deploy em Servidor
1. Faça upload dos arquivos para o servidor
2. Execute `npm run install-prod`
3. Execute `./start.sh` (Linux) ou `start.bat` (Windows)

## 📡 Portas Utilizadas

- **3000** - Aplicação Next.js (HTTP)
- **8081** - Servidor WebSocket
- **8888** - Servidor UDP

## 🔒 Segurança

O projeto inclui headers de segurança:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

## 📊 Monitoramento

Para monitorar a aplicação:
- Logs do servidor WebSocket/UDP no console
- Logs do Next.js no console
- Use `ENABLE_VERBOSE_LOGS=true` no `.env.local` para logs detalhados

## 🛠️ Solução de Problemas

### Erro de Build
```bash
# Limpar e reinstalar
npm run clean-install
npm run build-prod
```

### Porta em Uso
Verifique se as portas 3000, 8081 e 8888 estão disponíveis:
```bash
# Linux/macOS
lsof -i :3000
lsof -i :8081
lsof -i :8888

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8081
netstat -ano | findstr :8888
```

### Problemas de Permissão (Linux/macOS)
```bash
chmod +x start.sh
```

## 📝 Logs

Os logs são exibidos no console com cores diferentes:
- **Cyan** - Servidor WebSocket+UDP
- **Green** - Aplicação Next.js

## 🔄 Atualizações

Para atualizar o projeto:
1. Faça pull das mudanças
2. Execute `npm run install-prod`
3. Reinicie os serviços

## 📞 Suporte

Para problemas ou dúvidas, verifique:
1. Logs do console
2. Arquivo `.env.local`
3. Portas disponíveis
4. Permissões de arquivo (Linux/macOS)
