# Maritime Vessel Tracking – Frontend

React + Vite frontend for the Maritime Vessel Tracking, Port Analytics & Safety Visualization Platform. Connects to the existing Django REST backend.

## Tech Stack

- **React** 19 + **Vite** 7
- **React Router** – routing
- **Axios** – API calls (JWT in headers)
- **Tailwind CSS** – styling
- **Redux Toolkit** – auth state
- **Leaflet / React-Leaflet** – vessel map
- **Recharts** – port analytics charts
- **Lucide React** – icons

## Prerequisites

- Node.js 18+
- Backend running at `http://127.0.0.1:8000` (or set `VITE_API_BASE_URL` in `.env`)

## Setup & Run

```bash
# Install dependencies
npm install

# Development (with backend)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Default Vite port is 5173.

## Environment

Create or edit `.env` in the frontend root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

If omitted, the app falls back to `http://127.0.0.1:8000/api`.

## Backend API Endpoints Used

| Feature           | Endpoint                         |
|-------------------|----------------------------------|
| Auth              | `POST /api/auth/login/`          |
| Register          | `POST /api/auth/register/`       |
| Profile           | `GET /api/auth/profile/`         |
| Vessels           | `GET /api/vessels/`              |
| Safety zones      | `GET /api/vessels/safety/zones/` |
| Safety alerts     | `GET /api/vessels/safety/alerts/`|
| Notifications     | `GET /api/vessels/notifications/`|
| Port analytics    | `GET /api/vessels/ports/analytics/` |

All vessel/safety/notifications/analytics endpoints require JWT: `Authorization: Bearer <access_token>`.

## Project Structure

```
frontend/
├── src/
│   ├── api/           # Axios instance (baseURL, JWT)
│   ├── components/    # UI (auth, common, maps, ports, vessels, alerts)
│   ├── layouts/      # MainLayout, Sidebar, Navigation
│   ├── pages/        # Dashboard, Vessels, Safety, Notifications, etc.
│   ├── services/     # authService, vesselService
│   ├── stores/       # Redux (auth slice)
│   ├── utils/        # Leaflet icon fix
│   ├── App.jsx
│   └── main.jsx
├── .env              # VITE_API_BASE_URL
├── package.json
└── readme.md
```

## Features

1. **Authentication** – Login (JWT), optional signup; protected routes; token stored in `localStorage` as `access_token`.
2. **Dashboard** – Total/safe/danger vessels and active alerts from backend; live vessel map with safe (green) / danger (red) markers.
3. **Vessel map** – Vessels and safety zones from API; overlay toggles; 30s polling.
4. **Safety zones** – List of zones (name, lat, lon, radius) and live risk alerts.
5. **Notifications** – List of user notifications; auto-refresh every 15s.
6. **Vessel list** – Table: name, MMSI, IMO, type, flag, position, speed, status (SAFE/DANGER).
7. **Port analytics** – Port congestion and arrivals/departures from backend.

## Build

```bash
npm run build
npm run preview   # preview production build
```

## Notes

- Login: backend expects `username` and `password`. If you registered with email as username, use that same value for login.
- Ensure CORS is enabled on the Django backend for the frontend origin (e.g. `http://localhost:5173`).
