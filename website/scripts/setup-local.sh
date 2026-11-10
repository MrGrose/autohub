#!/usr/bin/env bash
# Локальная настройка website (.env.local + npm ci).
#   cd website && bash scripts/setup-local.sh
set -euo pipefail

WEBSITE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$WEBSITE"

echo "== Website: локальная настройка =="

if [[ ! -f .env.local ]]; then
  cat > .env.local << 'EOF'
CARS_API_URL=http://127.0.0.1:8000
EOF
  echo "✓ Создан .env.local"
fi

npm ci

echo "✓ Зависимости установлены"
echo "  Запуск: npm run dev  →  http://localhost:3000"
