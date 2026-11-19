# Mini Golf Score Tracker

[![Download on the App Store](https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83)](https://apps.apple.com/app/id6755137607)

An iOS + web app for tracking mini golf games: create a course, add any
number of players, enter scores hole-by-hole, and celebrate the winner.
Works offline during a round; wins persist per player across games.

- **iOS**: [App Store](https://apps.apple.com/app/id6755137607) — v1.1 (approved first review)
- **Web app**: [minigolfscoretracker.com](https://minigolfscoretracker.com)
- **API**: `api.minigolfscoretracker.com` (Flask on Render, Turso for storage)

<p align="center">
  <img src="app-view/public/app_view/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202025-11-11%20at%2000.49.16.png" width="220" alt="Home screen" />
  <img src="app-view/public/app_view/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202025-11-11%20at%2000.51.49.png" width="220" alt="Score tracking during a round" />
  <img src="app-view/public/app_view/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202025-11-11%20at%2000.52.03.png" width="220" alt="Winner celebration" />
</p>

## Stack

| Layer | Tech |
| --- | --- |
| iOS wrapper | Capacitor 7 |
| Web app | React 18 + Vite (`ui/`) |
| Marketing site | Next.js 15 (`app-view/`) → Netlify |
| API | Flask + gunicorn (`gthread`, 4 threads) on Render (`api/`) |
| Auth | JWT (PyJWT) |
| Database | [Turso](https://turso.tech) (libsql) |
| Monetization | Google AdMob + SKAdNetwork |

## Repo layout

```
api/          Flask API + database access layer (Turso in prod, sqlite3 in dev)
ui/           React + Vite web app; also the Capacitor iOS project (ui/ios/)
app-view/     Next.js marketing site → minigolfscoretracker.com
app-ads.txt   AdMob authorized-sellers file (served from the marketing site)
```

## Running locally

**API** (SQLite fallback, no Turso credentials required):

```bash
cd api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python wsgi.py            # or: gunicorn wsgi:app
```

**Web app**:

```bash
cd ui
npm install
npm run dev               # http://localhost:5173
```

**Marketing site**:

```bash
cd app-view
npm install
npm run dev               # http://localhost:3000
```

**iOS simulator** (from `ui/`):

```bash
npm run build && npx cap sync ios
open ios/App/App.xcworkspace
# ⌘R in Xcode with a simulator selected
```

## Deployment

- `api/` deploys to Render on push to `main`. The `wsgi.py` entry point is
  what gunicorn boots; `Procfile` / Render dashboard sets `-k gthread -w 1
  --threads 4 --timeout 120`. Turso credentials live in Render env vars
  (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) — when they're absent, the
  API falls back to a local sqlite file so dev keeps working.
- `ui/` builds via Netlify → served at `minigolfscoretracker.com` and
  bundled into the Capacitor iOS build.
- `app-view/` (marketing) builds via Netlify → also served at
  `minigolfscoretracker.com` root routes.
- iOS releases are cut from `ui/ios/App` in Xcode, uploaded to App Store
  Connect, and submitted for review.

## License

MIT.
