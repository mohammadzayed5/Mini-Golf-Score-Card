# SQLite-based data storage
from database import get_db, dict_from_row, dicts_from_rows, init_db
import hashlib
import secrets #For generating random salts
# Initialize database on import
init_db()

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
    """Return all games (newest last for now)"""
    with get_db() as conn:
        cursor = conn.cursor()
        if user_id is not None:
            cursor.execute(
                "SELECT * FROM games WHERE user_id = ? OR user_id IS NULL ORDER BY created_at",
                (user_id,)
            )
        else:
            cursor.execute("SELECT * FROM games ORDER BY created_at")

        games = dicts_from_rows(cursor.fetchall())

        # Add players and scores to each game
        for game in games:
            game_id = game['id']

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

        return games

def get_game(game_id: int) -> dict | None:
    """Find a single game by id. Return None if missing"""
    with get_db() as conn:
        cursor = conn.cursor()

        # Get game
        cursor.execute("SELECT * FROM games WHERE id = ?", (game_id,))
        game_row = cursor.fetchone()
        if not game_row:
            return None

        game = dict_from_row(game_row)

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

def update_game(game_id: int, *, name=None, holes=None, players=None) -> dict | None:
    """Update game fields. Handles resizing scores when holes/players change."""
    game = get_game(game_id)
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
        return get_game(game_id)


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
                "SELECT * FROM players WHERE user_id = ? OR user_id IS NULL ORDER BY created_at",
                (user_id,)
            )
        else:
            cursor.execute("SELECT * FROM players ORDER BY created_at")

        return dicts_from_rows(cursor.fetchall())

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
        return dict_from_row(row)

def set_score(game_id: int, player: str, hole_index: int, score) -> dict | None:
    """Set score (or None) for player at hole_index (0-based)."""
    game = get_game(game_id)
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

    return get_game(game_id)


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
                "SELECT * FROM courses WHERE user_id = ? OR user_id IS NULL ORDER BY created_at",
                (user_id,)
            )
        else:
            cursor.execute("SELECT * FROM courses ORDER BY created_at")

        return dicts_from_rows(cursor.fetchall())

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
        return dict_from_row(row)

def delete_player(player_id: int, user_id=None) -> bool:
    """Delete a player by id. Returns True if deleted, False if not found."""
    try:
        pid = int(player_id)
    except (TypeError, ValueError):
        return False

    with get_db() as conn:
        cursor = conn.cursor()
        if user_id is not None:
            # Delete if the player belongs to the user OR if it's a guest player (user_id is None)
            # This allows cleaning up guest data when logged in
            cursor.execute("DELETE FROM players WHERE id = ? AND (user_id = ? OR user_id IS NULL)", (pid, user_id))
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
            # Delete if the course belongs to the user OR if it's a guest course (user_id is None)
            # This allows cleaning up guest data when logged in
            cursor.execute("DELETE FROM courses WHERE id = ? AND (user_id = ? OR user_id IS NULL)", (cid, user_id))
        else:
            cursor.execute("DELETE FROM courses WHERE id = ?", (cid,))
        conn.commit()
        return cursor.rowcount > 0

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
    #Salt = random bytes that make each passsword hash unique
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
        #Return user infor (Without the password data for security)
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