#!/usr/bin/env bash
# Развёртывание backend (Docker: Postgres + API).
#   cd backend && bash scripts/deploy.sh
set -euo pipefail

BACKEND="$(cd "$(dirname "$0")/.." && pwd)"
cd "$BACKEND"

echo "== Backend: Docker =="

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "⚠ Создан .env — задайте SECRET_KEY, ADMIN_* и POSTGRES_*"
fi

docker compose up -d --build

echo "Ожидание API..."
for _ in $(seq 1 45); do
  if curl -sf http://127.0.0.1:8000/health >/dev/null; then
    break
  fi
  sleep 2
done

curl -sf http://127.0.0.1:8000/health || {
  echo "API недоступен: http://127.0.0.1:8000/health"
  exit 1
}

echo "✓ API:    http://127.0.0.1:8000"
echo "✓ Админка: http://127.0.0.1:8000/admin"
