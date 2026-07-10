# SQLite-based data storage
from database import get_db, dict_from_row, dicts_from_rows
import hashlib
import secrets #For generating random salts
import sqlite3
# init_db() is intentionally NOT called here. Doing it at module import
# means every gunicorn worker runs 11 CREATE TABLE/INDEX statements over
# the network against Turso on boot, which blows past gunicorn's worker
# timeout on cold starts. app.create_app() calls it once during startup.

def create_game(name: str, holes: int, players=None, user_id=None) -> dict:
    """Create and return a new game record.
    players: list[str] of player names
    """
    players = [p.strip() for p in (players or []) if str(p).strip()]
    holes = int(holes)

    with get_db() as conn:
        cursor = conn.cursor()

        # Create game
        cursor.execute(
            "INSERT INTO games (user_id, name, holes) VALUES (?, ?, ?)",
            (user_id, name, holes)
        )
        game_id = cursor.lastrowid

        # Add players to game
        for i, player in enumerate(players):
            cursor.execute(
                "INSERT INTO game_players (game_id, player_name, position) VALUES (?, ?, ?)",
                (game_id, player, i)
            )

        # Initialize scores (all None)
        for player in players:
            for hole in range(holes):
                cursor.execute(
                    "INSERT INTO scores (game_id, player_name, hole_number, score) VALUES (?, ?, ?, ?)",
                    (game_id, player, hole, None)
                )

        conn.commit()

        # Return the complete game object
        return get_game(game_id)

def list_games(user_id=None) -> list[dict]:
    """Return all games (newest last for now). Uses 3 queries total instead of 2N+1."""
    with get_db() as conn:
        cursor = conn.cursor()
        if user_id is not None:
            cursor.execute(
                "SELECT * FROM games WHERE user_id = ? ORDER BY created_at",
                (user_id,)
            )
        else:
            cursor.execute("SELECT * FROM games ORDER BY created_at")

        games = dicts_from_rows(cursor, cursor.fetchall())
        if not games:
            return games

        game_ids = [g['id'] for g in games]
        placeholders = ",".join("?" for _ in game_ids)

        # Fetch all players for these games in one query
        cursor.execute(
            f"SELECT game_id, player_name FROM game_players WHERE game_id IN ({placeholders}) ORDER BY game_id, position",
            game_ids,
        )
        players_by_game: dict[int, list[str]] = {gid: [] for gid in game_ids}
        for gid, name in cursor.fetchall():
            players_by_game[gid].append(name)

        # Fetch all scores for these games in one query
        cursor.execute(
            f"SELECT game_id, player_name, hole_number, score FROM scores WHERE game_id IN ({placeholders})",
            game_ids,
        )
        scores_rows = cursor.fetchall()

        games_by_id: dict[int, dict] = {}
        for game in games:
            gid = game['id']
            players = players_by_game.get(gid, [])
            game['players'] = players
            game['scores'] = {p: [None] * game['holes'] for p in players}
            games_by_id[gid] = game

        for gid, player_name, hole_number, score in scores_rows:
            game = games_by_id.get(gid)
            if game is None:
                continue
            game_scores = game['scores']
            if player_name in game_scores and 0 <= hole_number < game['holes']:
                game_scores[player_name][hole_number] = score

        return games

def get_game(game_id: int, user_id=None) -> dict | None:
    """Find a single game by id. Return None if missing.

    When user_id is given, only return the game if that user owns it —
    callers handling authenticated requests MUST pass user_id.
    """
    with get_db() as conn:
        cursor = conn.cursor()

        # Get game
        if user_id is not None:
            cursor.execute("SELECT * FROM games WHERE id = ? AND user_id = ?", (game_id, user_id))
        else:
            cursor.execute("SELECT * FROM games WHERE id = ?", (game_id,))
        game_row = cursor.fetchone()
        if not game_row:
            return None

        game = dict_from_row(cursor, game_row)

        # Get players
        cursor.execute(
            "SELECT player_name FROM game_players WHERE game_id = ? ORDER BY position",
            (game_id,)
        )
        game['players'] = [row[0] for row in cursor.fetchall()]

        # Get scores
        cursor.execute(
            "SELECT player_name, hole_number, score FROM scores WHERE game_id = ? ORDER BY player_name, hole_number",
            (game_id,)
        )
        scores_data = cursor.fetchall()

        # Rebuild scores dict
        scores = {}
        for player in game['players']:
            scores[player] = [None] * game['holes']

        for player_name, hole_number, score in scores_data:
            if player_name in scores and 0 <= hole_number < game['holes']:
                scores[player_name][hole_number] = score

        game['scores'] = scores
        return game

def update_game(game_id: int, *, name=None, holes=None, players=None, user_id=None) -> dict | None:
    """Update game fields. Handles resizing scores when holes/players change.

    When user_id is given, only the owner's game can be updated.
    """
    game = get_game(game_id, user_id)
    if not game:
        return None

    with get_db() as conn:
        cursor = conn.cursor()

        # Update name if provided
        if name is not None:
            clean_name = str(name).strip() or game["name"]
            cursor.execute("UPDATE games SET name = ? WHERE id = ?", (clean_name, game_id))

        # Update holes if provided
        if holes is not None:
            new_holes = int(holes)
            if new_holes != game["holes"]:
                cursor.execute("UPDATE games SET holes = ? WHERE id = ?", (new_holes, game_id))

                # Handle score resizing
                for player in game['players']:
                    if new_holes > game["holes"]:
                        # Add new holes with None scores
                        for hole in range(game["holes"], new_holes):
                            cursor.execute(
                                "INSERT INTO scores (game_id, player_name, hole_number, score) VALUES (?, ?, ?, ?)",
                                (game_id, player, hole, None)
                            )
                    else:
                        # Remove excess holes
                        cursor.execute(
                            "DELETE FROM scores WHERE game_id = ? AND hole_number >= ?",
                            (game_id, new_holes)
                        )

        # Update players if provided
        if players is not None:
            new_players = [str(p).strip() for p in players if str(p).strip()]

            # Remove old players
            cursor.execute("DELETE FROM game_players WHERE game_id = ?", (game_id,))
            cursor.execute("DELETE FROM scores WHERE game_id = ?", (game_id,))

            # Add new players
            current_holes = holes if holes is not None else game["holes"]
            for i, player in enumerate(new_players):
                cursor.execute(
                    "INSERT INTO game_players (game_id, player_name, position) VALUES (?, ?, ?)",
                    (game_id, player, i)
                )

                # Add scores for this player (keep existing if player existed before)
                for hole in range(current_holes):
                    old_score = None
                    if player in game['scores'] and hole < len(game['scores'][player]):
                        old_score = game['scores'][player][hole]

                    cursor.execute(
                        "INSERT INTO scores (game_id, player_name, hole_number, score) VALUES (?, ?, ?, ?)",
                        (game_id, player, hole, old_score)
                    )

        conn.commit()
        return get_game(game_id, user_id)


def create_player(name: str, *, wins: int = 0, user_id=None) -> dict:
    """Create and return a player record."""
    clean = " ".join(str(name).split())
    if not clean:
        raise ValueError("Name is required")

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO players (user_id, name, wins) VALUES (?, ?, ?)",
            (user_id, clean, int(wins))
        )
        player_id = cursor.lastrowid
        conn.commit()

        return {"id": player_id, "name": clean, "wins": int(wins)}

def list_players(user_id=None) -> list[dict]:
    """Return all players (newest last)"""
    with get_db() as conn:
        cursor = conn.cursor()
        if user_id is not None:
            cursor.execute(
                "SELECT * FROM players WHERE user_id = ? ORDER BY created_at",
                (user_id,)
            )
        else:
            cursor.execute("SELECT * FROM players ORDER BY created_at")

        return dicts_from_rows(cursor, cursor.fetchall())

def get_player(player_id: int) -> dict | None:
    """Return a single player by id, or None."""
    try:
        pid = int(player_id)
    except (TypeError, ValueError):
        return None

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM players WHERE id = ?", (pid,))
        row = cursor.fetchone()
        return dict_from_row(cursor, row)
    
def update_player_wins(player_name: str, user_id=None) -> bool:
    #increment wins for a player by their name
    with get_db() as conn:
        cursor = conn.cursor()
        #Try to find the existing player
        if user_id is not None:
            cursor.execute(
                "UPDATE players SET wins = wins + 1 WHERE name = ? AND user_id = ?",
                (player_name, user_id)
            )
        else:
            cursor.execute(
                "UPDATE players SET wins = wins + 1 WHERE name = ? AND user_id IS NULL",
                (player_name,)
            )
        if cursor.rowcount > 0:
            conn.commit()
            return True
        #If no existing player is found, create one with 1 win
        try:
            cursor.execute(
                "INSERT INTO players (user_id, name, wins) VALUES (?,?,1)",
                (user_id, player_name)
            )
            conn.commit()
            return True
        except Exception as e:
            #Handle race condition if player was created between UPDATE and INSERT.
            #sqlite3 raises IntegrityError; libsql surfaces constraint violations
            #as its own error type, so match on the message as well.
            if isinstance(e, sqlite3.IntegrityError) or "constraint" in str(e).lower():
                return False
            raise


def set_score(game_id: int, player: str, hole_index: int, score, user_id=None) -> dict | None:
    """Set score (or None) for player at hole_index (0-based).

    When user_id is given, only the owner's game can be scored.
    """
    game = get_game(game_id, user_id)
    if not game:
        return None

    name = str(player).strip()
    if name not in game["scores"]:
        return None

    try:
        h = int(hole_index)
    except (TypeError, ValueError):
        return None

    if not (0 <= h < game["holes"]):
        return None

    val = None if score is None else int(score)

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE scores SET score = ? WHERE game_id = ? AND player_name = ? AND hole_number = ?",
            (val, game_id, name, h)
        )
        conn.commit()

    return get_game(game_id, user_id)


def create_course(name: str, holes: int, user_id=None) -> dict:
    """Create and return a course record."""
    clean = " ".join(str(name).split())
    holes = int(holes)

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO courses (user_id, name, holes) VALUES (?, ?, ?)",
            (user_id, clean, holes)
        )
        course_id = cursor.lastrowid
        conn.commit()

        return {"id": course_id, "name": clean, "holes": holes}

def list_courses(user_id=None) -> list[dict]:
    """Return all courses"""
    with get_db() as conn:
        cursor = conn.cursor()
        if user_id is not None:
            cursor.execute(
                "SELECT * FROM courses WHERE user_id = ? ORDER BY created_at",
                (user_id,)
            )
        else:
            cursor.execute("SELECT * FROM courses ORDER BY created_at")

        return dicts_from_rows(cursor, cursor.fetchall())

def get_course(course_id: int) -> dict | None:
    """Return a single course by id, or None."""
    try:
        cid = int(course_id)
    except (TypeError, ValueError):
        return None

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM courses WHERE id = ?", (cid,))
        row = cursor.fetchone()
        return dict_from_row(cursor, row)

def delete_player(player_id: int, user_id=None) -> bool:
    """Delete a player by id. Returns True if deleted, False if not found."""
    try:
        pid = int(player_id)
    except (TypeError, ValueError):
        return False

    with get_db() as conn:
        cursor = conn.cursor()
        if user_id is not None:
            cursor.execute("DELETE FROM players WHERE id = ? AND user_id = ?", (pid, user_id))
        else:
            cursor.execute("DELETE FROM players WHERE id = ?", (pid,))
        conn.commit()
        return cursor.rowcount > 0

def delete_course(course_id: int, user_id=None) -> bool:
    """Delete a course by id. Returns True if deleted, False if not found."""
    try:
        cid = int(course_id)
    except (TypeError, ValueError):
        return False

    with get_db() as conn:
        cursor = conn.cursor()
        if user_id is not None:
            cursor.execute("DELETE FROM courses WHERE id = ? AND user_id = ?", (cid, user_id))
        else:
            cursor.execute("DELETE FROM courses WHERE id = ?", (cid,))
        conn.commit()
        return cursor.rowcount > 0

def decrement_player_wins(player_name: str, user_id=None, count: int = 1) -> bool:
    """Decrement wins for a player by name. Used when deleting games."""
    with get_db() as conn:
        cursor = conn.cursor()
        if user_id is not None:
            cursor.execute(
                "UPDATE players SET wins = MAX(0, wins - ?) WHERE name = ? AND user_id = ?",
                (count, player_name, user_id)
            )
        else:
            cursor.execute(
                "UPDATE players SET wins = MAX(0, wins - ?) WHERE name = ? AND user_id IS NULL",
                (count, player_name)
            )
        conn.commit()
        return cursor.rowcount > 0

def delete_game(game_id: int, user_id=None) -> bool:
    """Delete a game by id. Returns True if deleted, False if not found."""
    try:
        gid = int(game_id)
    except (TypeError, ValueError):
        return False

    with get_db() as conn:
        cursor = conn.cursor()

        # Verify the game exists (and belongs to the user) BEFORE deleting anything.
        # This is also required for correctness on libsql, where cursor.rowcount is
        # cumulative per connection, so checking it after multiple DELETEs lies.
        if user_id is not None:
            cursor.execute("SELECT id FROM games WHERE id = ? AND user_id = ?", (gid, user_id))
        else:
            cursor.execute("SELECT id FROM games WHERE id = ?", (gid,))
        if cursor.fetchone() is None:
            return False

        # Delete related data first (foreign key constraints)
        cursor.execute("DELETE FROM game_players WHERE game_id = ?", (gid,))
        cursor.execute("DELETE FROM scores WHERE game_id = ?", (gid,))
        cursor.execute("DELETE FROM games WHERE id = ?", (gid,))

        conn.commit()
        return True

def create_user(username: str, password: str) -> dict:

    """
      Create a new user account with secure password storage.
      
      How password security works:
      1. Generate a random 'salt' (random bytes)
      2. Combine password + salt and hash it 
      3. Store the salt + hash (NOT the original password)
      4. When user logs in, repeat process and compare hashes
      
      Args:
          username: Unique username for the account
          password: Plain text password (we'll hash it securely)
          
      Returns:
          dict: User record with id, username, created_at
          
      Raises:
          ValueError: If username already exists or is invalid
      """
    #Clean and validate username
    clean_username = username.strip().lower()
    if not clean_username:
        raise ValueError("Username cannot be empty")
    if len(clean_username) < 3 or len(clean_username) > 30:
        raise ValueError("Username must be between 3 and 30 characters")
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE username = ?", (clean_username,))
        existing_user = cursor.fetchone()

        if existing_user:
            raise ValueError("Username already exists")
    #Salt = random bytes that make each password hash unique
    salt = secrets.token_bytes(32) #Generate 32 random bytes
    password_hash = hashlib.pbkdf2_hmac(
        'sha256',                         #Hash algorithm
        password.encode('utf-8'),        #Convert password to bytes
        salt,                            #The random salt
        100000                           #Number of iterations (security)
    )
    #Store salt and hash to verify login later 
    #Convert bytes to hex strings for database storage
    salt_hex = salt.hex()   #Convert salt bytes to text
    hash_hex = password_hash.hex() #Convert hash bytes to text

    #Insert user into database
    with get_db() as conn:
        cursor = conn.cursor()
        #Insert new user with username, salt, and hash
        cursor.execute(
            "INSERT INTO users (username, password_salt, password_hash) VALUES (?, ?, ?)",
            (clean_username, salt_hex, hash_hex)
        )
        #Get the ID of the user we just created
        user_id = cursor.lastrowid
        #Save changes to database
        conn.commit()
        #Return user info (Without the password data for security)
        return {
            "id": user_id,
            "username": clean_username,
            "created_at": "just created" #Could query for exact timestamp if needed
        }
def authenticate_user(username: str, password: str) -> dict | None:
    """
      Verify user login credentials and return user info if valid.
      
      How login verification works:
      1. Find user by username in database
      2. Get their stored salt and password hash  
      3. Hash the entered password using their salt
      4. Compare new hash with stored hash
      5. If they match = login success!
      
      Args:
          username: Username to look up
          password: Plain text password to verify
          
      Returns:
          dict: User info (id, username) if login successful
          None: If username doesn't exist or password is wrong
      """
    #Clean username and find user in database
    clean_username = username.strip().lower()
    with get_db() as conn:
        cursor = conn.cursor()
        #Get ALL columns (*) FROM users table WHERE username matches
        cursor.execute("SELECT * FROM users WHERE username = ?", (clean_username,))
        user_row = cursor.fetchone()  # Get one result

        #If no user found, return None (login failed)
        if not user_row:
            return None
        #Extract stores salt and hash from database row
        stored_salt_hex = user_row[2] #password_salt column
        stored_hash_hex = user_row[3] #password_hash column

        #Convert hex strings back to bytes
        stored_salt = bytes.fromhex(stored_salt_hex)
        stored_hash = bytes.fromhex(stored_hash_hex)

        #Hash the entered password using the stored salt
        #This is the SAME process as create_user, but using THEIR salt
        entered_password_hash = hashlib.pbkdf2_hmac(
        'sha256',                           # Same algorithm
        password.encode('utf-8'),           # The password they just entered
        stored_salt,                        # Their unique salt from database
        100000                              # Same number of iterations
        )
        #Compare and return result
        if entered_password_hash == stored_hash:
            return {
                "id": user_row[0],
                "username": user_row[1],
                "authenticated": True
            }
        else:
            return None

def delete_user(user_id: int) -> bool:
    """
    Permanently delete a user and all their associated data.

    This function will:
    1. Delete all games created by the user
    2. Delete all players created by the user
    3. Delete all courses created by the user
    4. Delete the user account itself

    Args:
        user_id: ID of the user to delete

    Returns:
        bool: True if deletion was successful, False otherwise
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()

            # Delete all user's games (this will cascade to game_scores due to foreign key)
            cursor.execute("DELETE FROM games WHERE user_id = ?", (user_id,))

            # Delete all user's players
            cursor.execute("DELETE FROM players WHERE user_id = ?", (user_id,))

            # Delete all user's courses
            cursor.execute("DELETE FROM courses WHERE user_id = ?", (user_id,))

            # Finally, delete the user account
            cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))

            # Commit all the deletions
            conn.commit()

            return True
    except Exception as e:
        print(f"Error deleting user {user_id}: {e}")
        return False