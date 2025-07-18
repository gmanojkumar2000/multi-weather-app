# Weather-Now

A production-ready weather app that lets users search for any city and view current weather conditions, powered by Open-Meteo (100% free, no API key required).

---

## 🚀 Quick Start

1. **Dev mode (hot reload):**
   ```sh
   make dev
   ```
2. **Production build:**
   ```sh
   docker compose up --build
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

---

## 🔄 Switching Weather API

- By default, uses [Open-Meteo](https://open-meteo.com/). To switch to another provider (e.g., OpenWeatherMap):
  1. Update `.env` in `backend/` with the new API base URL and parameters.
  2. Adjust `services/geocode.py` and `services/weather.py` to match the new API's response format.

---

## 🏗️ Project Structure

```
weather-now/
├── backend/
│   ├── main.py
│   ├── services/
│   │   ├── geocode.py
│   │   └── weather.py
│   ├── cache.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   └── components/…
│   ├── index.html
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## 🧑‍💻 Developer Experience

- **Pre-commit hooks:** `black`, `ruff`, `isort`, `prettier`.
- **Unit tests:** `pytest` (backend), `react-testing-library` (frontend).
- **CI:** Lint & test on every push (see `.github/workflows/ci.yml`).

---

## 🚀 Deployment

- **Fly.io:**
  - Add a `fly.toml` and deploy with `fly launch`.
- **Render:**
  - Add a `render.yaml` and connect your repo.
- Both platforms support Docker Compose out of the box.

---

## 📚 References
- [Open-Meteo API Docs](https://open-meteo.com/en/docs)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/) 