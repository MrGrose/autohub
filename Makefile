.PHONY: help backend-up backend-down backend-logs backend-test website-install website-dev website-build

help:
	@echo "backend-up backend-down backend-logs backend-test website-install website-dev website-build"

backend-up:
	cd backend && docker compose up --build -d

backend-down:
	cd backend && docker compose down

backend-logs:
	cd backend && docker compose logs -f api

backend-test:
	cd backend && pytest -q

website-install:
	cd website && npm ci

website-dev:
	cd website && npm run dev

website-build:
	cd website && npm run build
