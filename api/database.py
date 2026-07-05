import sqlite3
import os
from contextlib import contextmanager

# Turso (libsql) when configured, local SQLite file otherwise.
# Render's free-tier disk is ephemeral, so production MUST use Turso —
# a local minigolf.db there is wiped on every deploy/restart.
TURSO_DATABASE_URL = os.environ.get("TURSO_DATABASE_URL")
TURSO_AUTH_TOKEN = os.environ.get("TURSO_AUTH_TOKEN")

DATABASE_PATH = "minigolf.db"

if TURSO_DATABASE_URL:
    import libsql


def _connect():
    if TURSO_DATABASE_URL:
        if TURSO_AUTH_TOKEN:
            return libsql.connect(TURSO_DATABASE_URL, auth_token=TURSO_AUTH_TOKEN)
        return libsql.connect(TURSO_DATABASE_URL)
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the database with required tables."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Users table (for future authentication)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_salt TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Games table
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

        # Players table
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

        # Courses table
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

        # Game participants (tracks which players are in which game)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS game_players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                game_id INTEGER NOT NULL,
                player_name TEXT NOT NULL,
                position INTEGER NOT NULL,
                FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
            )
        """)

        # Individual scores for each hole
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

        # Indexes on the FK columns we actually filter/join on. Small tables today,
        # but this is a free win as the DB grows.
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

    Works for both sqlite3.Row and libsql tuple rows.
    """
    if row is None:
        return None
    columns = [d[0] for d in cursor.description]
    return dict(zip(columns, row))

def dicts_from_rows(cursor, rows):
    """Convert a list of DB-API rows to dicts using the cursor's column names."""
    columns = [d[0] for d in cursor.description]
    return [dict(zip(columns, row)) for row in rows]
