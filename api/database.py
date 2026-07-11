"""Database access layer.

On Render (production): talks to Turso via its /v2/pipeline HTTP API using
a small DB-API-shaped wrapper on top of `requests`. We previously used the
`libsql` Python package but its embedded tokio runtime deadlocks under
gunicorn's threaded worker (Rust panic: "failed to join thread: Resource
deadlock avoided"), which took the API down.

Locally: falls back to a plain sqlite3 file so dev keeps working without
Turso credentials.
"""
import sqlite3
import os
import base64
from contextlib import contextmanager

TURSO_DATABASE_URL = os.environ.get("TURSO_DATABASE_URL")
TURSO_AUTH_TOKEN = os.environ.get("TURSO_AUTH_TOKEN")

DATABASE_PATH = "minigolf.db"

if TURSO_DATABASE_URL:
    import requests
    # Turso hands out URLs as `libsql://xxx.turso.io`; the HTTP endpoint
    # is the same host over https.
    _host_part = TURSO_DATABASE_URL.split("://", 1)[1] if "://" in TURSO_DATABASE_URL else TURSO_DATABASE_URL
    _TURSO_ENDPOINT = "https://" + _host_part.rstrip("/") + "/v2/pipeline"


class TursoError(Exception):
    """Raised on any error from Turso's /v2/pipeline. Message preserves the
    original text so callers can match on "constraint" for UNIQUE etc."""


def _to_value(v):
    if v is None:
        return {"type": "null"}
    if isinstance(v, bool):
        return {"type": "integer", "value": "1" if v else "0"}
    if isinstance(v, int):
        return {"type": "integer", "value": str(v)}
    if isinstance(v, float):
        return {"type": "float", "value": v}
    if isinstance(v, bytes):
        return {"type": "blob", "base64": base64.b64encode(v).decode("ascii")}
    return {"type": "text", "value": str(v)}


def _from_value(v):
    t = v.get("type")
    if t == "null":
        return None
    if t == "integer":
        return int(v["value"])
    if t == "float":
        return float(v["value"])
    if t == "text":
        return v["value"]
    if t == "blob":
        return base64.b64decode(v["base64"])
    return v.get("value")


_WRITE_KEYWORDS = ("INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER", "REPLACE")


class TursoCursor:
    def __init__(self, conn):
        self._conn = conn
        self.description = None
        self._rows = []
        self._row_idx = 0
        self.lastrowid = None
        self.rowcount = -1

    def execute(self, sql, params=()):
        result = self._conn._execute_stmt(sql, params or ())
        cols = result.get("cols") or []
        self.description = [(c.get("name"), None, None, None, None, None, None) for c in cols]
        self._rows = [tuple(_from_value(v) for v in row) for row in (result.get("rows") or [])]
        self._row_idx = 0
        lir = result.get("last_insert_rowid")
        self.lastrowid = int(lir) if lir is not None else None
        arc = result.get("affected_row_count")
        self.rowcount = int(arc) if arc is not None else -1
        return self

    def fetchone(self):
        if self._row_idx >= len(self._rows):
            return None
        row = self._rows[self._row_idx]
        self._row_idx += 1
        return row

    def fetchall(self):
        remaining = self._rows[self._row_idx:]
        self._row_idx = len(self._rows)
        return remaining

    def close(self):
        pass


class TursoConnection:
    def __init__(self, endpoint, token):
        self._url = endpoint
        self._session = requests.Session()
        self._session.headers.update({
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        })
        self._baton = None
        self._in_transaction = False
        self._closed = False

    def cursor(self):
        return TursoCursor(self)

    def commit(self):
        if self._in_transaction:
            self._pipeline([{"type": "execute", "stmt": {"sql": "COMMIT"}}])
            self._in_transaction = False

    def rollback(self):
        if self._in_transaction:
            try:
                self._pipeline([{"type": "execute", "stmt": {"sql": "ROLLBACK"}}])
            except Exception:
                pass
            self._in_transaction = False

    def close(self):
        if self._closed:
            return
        self._closed = True
        try:
            self.rollback()
        finally:
            if self._baton is not None:
                try:
                    self._pipeline([{"type": "close"}])
                except Exception:
                    pass
            self._session.close()

    def _pipeline(self, requests_list):
        payload = {"baton": self._baton, "requests": requests_list}
        try:
            resp = self._session.post(self._url, json=payload, timeout=30)
        except requests.RequestException as e:
            raise TursoError(f"network error: {e}") from e
        if resp.status_code != 200:
            raise TursoError(f"HTTP {resp.status_code}: {resp.text[:500]}")
        data = resp.json()
        self._baton = data.get("baton")
        for r in data.get("results", []):
            if r.get("type") != "ok":
                err = r.get("error") or {}
                msg = err.get("message") or str(err) or "unknown error"
                raise TursoError(msg)
        return data

    def _execute_stmt(self, sql, params):
        args = [_to_value(p) for p in params]
        stmt = {"sql": sql, "args": args}

        first_kw = sql.lstrip().split(None, 1)[0].upper() if sql.strip() else ""
        is_write = first_kw in _WRITE_KEYWORDS

        requests_to_send = []
        if is_write and not self._in_transaction:
            requests_to_send.append({"type": "execute", "stmt": {"sql": "BEGIN"}})
            self._in_transaction = True
        requests_to_send.append({"type": "execute", "stmt": stmt})

        data = self._pipeline(requests_to_send)
        return data["results"][-1]["response"]["result"]

    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass


def _connect():
    if TURSO_DATABASE_URL:
        return TursoConnection(_TURSO_ENDPOINT, TURSO_AUTH_TOKEN)
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the database with required tables."""
    with get_db() as conn:
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_salt TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT NULL,
                name TEXT NOT NULL,
                holes INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT NULL,
                name TEXT NOT NULL,
                wins INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT NULL,
                name TEXT NOT NULL,
                holes INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS game_players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                game_id INTEGER NOT NULL,
                player_name TEXT NOT NULL,
                position INTEGER NOT NULL,
                FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                game_id INTEGER NOT NULL,
                player_name TEXT NOT NULL,
                hole_number INTEGER NOT NULL,
                score INTEGER,
                FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,
                UNIQUE (game_id, player_name, hole_number)
            )
        """)

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_game_players_game_id ON game_players(game_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_scores_game_id ON scores(game_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id)")

        conn.commit()


@contextmanager
def get_db():
    """Context manager for database connections."""
    conn = _connect()
    try:
        yield conn
    finally:
        conn.close()


def dict_from_row(cursor, row):
    """Convert a DB-API row to dict using the cursor's column names.

    Works for both sqlite3.Row and Turso tuple rows.
    """
    if row is None:
        return None
    columns = [d[0] for d in cursor.description]
    return dict(zip(columns, row))


def dicts_from_rows(cursor, rows):
    """Convert a list of DB-API rows to dicts using the cursor's column names."""
    columns = [d[0] for d in cursor.description]
    return [dict(zip(columns, row)) for row in rows]
