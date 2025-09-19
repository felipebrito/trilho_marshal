#!/bin/bash

# Trilho Marshal - Script de Instalação Automática
# Execute: chmod +x install.sh && ./install.sh

echo "🚀 Trilho Marshal - Instalação Automática"
echo "========================================"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "📥 Instale o Node.js em: https://nodejs.org/"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ necessária (atual: $(node -v))"
    echo "📥 Atualize o Node.js em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado!"
    exit 1
fi

echo "✅ npm $(npm -v) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Criar arquivo de configuração se não existir
if [ ! -f "config.js" ]; then
    echo "📝 Criando arquivo de configuração..."
    cp config.example.js config.js
    echo "✅ Arquivo config.js criado"
fi

# Verificar se as imagens existem
echo "🖼️ Verificando imagens..."
if [ ! -f "public/bg300x200-comtv.jpg" ]; then
    echo "⚠️ Imagem de fundo não encontrada: public/bg300x200-comtv.jpg"
fi

if [ ! -d "public/imagens" ]; then
    echo "⚠️ Pasta de imagens não encontrada: public/imagens/"
    echo "📁 Criando estrutura de pastas..."
    mkdir -p public/imagens/{1966,1989,1990,2004,2005,2015,2016,2017,2019,2024,2025,FUTURO}
    echo "✅ Estrutura de pastas criada"
fi

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo ""
echo "📖 Para executar a aplicação:"
echo "   npm run dev"
echo ""
echo "📖 Para executar o servidor UDP:"
echo "   npm run udp-server"
echo ""
echo "📖 Para ver todos os comandos:"
echo "   npm run help"
echo ""
echo "🌐 A aplicação estará disponível em:"
echo "   http://localhost:3000"
echo ""
echo "🎮 Controles básicos:"
echo "   C = Alternar modos"
echo "   R = Reset posição ideal"
echo "   O/P = Movimento horizontal"
echo ""
echo "✨ Aproveite o Trilho Marshal!"
