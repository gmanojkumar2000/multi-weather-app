DEV_FRONTEND = cd frontend && npm run dev
DEV_BACKEND = cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

.PHONY: dev test lint format

dev:
	docker compose up redis -d
	taskkill /IM uvicorn.exe /F 2> NUL || true
	taskkill /IM node.exe /F 2> NUL || true
	start cmd /k "$(DEV_BACKEND)"
	start cmd /k "$(DEV_FRONTEND)"

test:
	cd backend && pytest
	cd frontend && npm test

lint:
	cd backend && ruff . && black --check . && isort --check-only .
	cd frontend && npm run lint

format:
	cd backend && black . && isort .
	cd frontend && npm run format 