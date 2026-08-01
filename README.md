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
| Database | [Turso](https://turso.tech) (libsql) via a custom pure-Python HTTP client — see below |
| Monetization | Google AdMob + SKAdNetwork |

## The Turso HTTP client story

The API originally used the official `libsql` Python package. It deadlocked
under gunicorn's threaded worker — the embedded tokio runtime can't cleanly
shut down when called across Python threads, and every request would 502
with a Rust panic in Render's logs:

```
thread 'tokio-runtime-worker' panicked: failed to join thread: Resource deadlock avoided (os error 35)
```

Rather than move to a sync worker or off Turso, I wrote a pure-Python
DB-API 2.0 client for Turso's hrana `/v2/pipeline` HTTP protocol using only
`requests`. It's now [its own repo](https://github.com/mohammadzayed5/turso-http)
you can pip-install and drop in wherever `sqlite3` used to sit.

- **Repo**: [github.com/mohammadzayed5/turso-http](https://github.com/mohammadzayed5/turso-http)
- **Write-up**: [Rewriting Turso's Python client because the official one deadlocks under gunicorn](https://github.com/mohammadzayed5/turso-http/blob/main/POST_DRAFT.md)

## Repo layout

```
api/          Flask API + database access layer (uses turso-http in prod, sqlite3 in dev)
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
