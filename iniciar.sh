#!/bin/bash

# Define o caminho base (onde o script está)
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Iniciando Gerenciador Financeiro..."

# 1. Inicia o Backend (Django com Gunicorn) em segundo plano
echo "Starting Backend..."
cd "$BASE_DIR/backend"
source venv/bin/activate
# Roda o Gunicorn na porta 8000, em background (&)
# O '--access-logfile -' mostra os logs no terminal (opcional)
./venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:8001 --access-logfile - &
BACKEND_PID=$! # Salva o ID do processo para matar depois

# Espera um pouco para o backend subir
sleep 2

# 2. Inicia o Frontend (Next.js)
echo "Starting Frontend..."
cd "$BASE_DIR/frontend"
# Roda o servidor de produção do Next.js na porta 3001
npm start -- -p 3001 &
FRONTEND_PID=$!

echo "🌍 Abrindo navegador..."
# Espera 2 segundinhos para garantir que o Next.js subiu
sleep 2 
# Abre a URL no navegador padrão (silenciosamente)
xdg-open http://localhost:3001 > /dev/null 2>&1 &
# --------------------------

echo "✅ Tudo rodando! Acesse: http://localhost:3001"
echo "🔴 Pressione [CTRL+C] para encerrar tudo."

# 3. Função para matar tudo quando você der Ctrl+C
cleanup() {
    echo "Encerrando processos..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Fica esperando o Ctrl+C
trap cleanup SIGINT
wait
