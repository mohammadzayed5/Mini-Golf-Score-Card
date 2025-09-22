#This will be text database for now

#When server dies, all data will disappear

#GAMES
GAMES = []
NEXT_ID = 1
#create_game, list_games, get_game, update_game


#PLAYERS
PLAYERS = [] # [{"id": int, "name": str, "wins": int}]
NEXT_PLAYER_ID = 1

#Courses
COURSES = []   # [{"id": int, "name": str, "holes": int}]
NEXT_COURSE_ID = 1

def create_game(name: str, holes: int, players=None) -> dict:

#Create and return a new game record.
#players: list[str] of player names
    global NEXT_ID
    players = [p.strip() for p in (players or []) if str(p).strip()]
    holes = int(holes)

    game = {
        "id": NEXT_ID,
        "name": name,
        "holes": holes,
        "players": players,
        "scores": {p: [None] * holes for p in players},
    }
    GAMES.append(game)
    NEXT_ID += 1
    return game

def list_games() -> list[dict]:
    #Return all games (newest last for now)
    return GAMES

def get_game(game_id: int) -> dict | None:
    #Find a single game by id. Return None if missing
    return next((g for g in GAMES if g["id"] == game_id),None)

def update_game(game_id: int, *, name=None, holes=None, players=None) -> dict | None:
    #any field can be omitted, If the holes change, then it will resize the scores, 
    #If the players change, then it will rebuild the scores dict to keep existin scores when possible
    game = get_game(game_id)
    if not game:
        return None
    if name is not None:
        game["name"] = str(name).strip() or game["name"]
    if holes is not None:
        new_holes = int(holes)
        if new_holes != game["holes"]:
            # resize all score arrays
            for p in game["scores"]:
                cur = game["scores"][p]
                if new_holes > len(cur):
                    game["scores"][p] = cur + [None] * (new_holes - len(cur))
                else:
                    game["scores"][p] = cur[:new_holes]
            game["holes"] = new_holes

    if players is not None:
        new_players = [str(p).strip() for p in players if str(p).strip()]
        # keep any existing scores when names overlap
        new_scores = {}
        for p in new_players:
            if p in game["scores"]:
                # trim/extend to holes
                cur = game["scores"][p]
                h = game["holes"]
                new_scores[p] = (cur + [None] * h)[:h]
            else:
                new_scores[p] = [None] * game["holes"]
        game["players"] = new_players
        game["scores"] = new_scores

    return game


def create_player(name: str, *, wins: int = 0) -> dict:
    #Create and return a player record.
    global NEXT_PLAYER_ID
    clean = " ".join(str(name).split())
    if not clean:
        raise ValueError("Name is required")
    
    player = {"id": NEXT_PLAYER_ID, "name": clean, "wins": int(wins)}
    PLAYERS.append(player)
    NEXT_PLAYER_ID += 1
    return player

def list_players() -> list[dict]:
    #return all plxayers (newest last)
    return PLAYERS

def get_player(player_id: int) -> dict | None:
    #Return a single player by id, or None.
    try:
        pid = int(player_id)
    except (TypeError, ValueError):
        return None
    return next((p for p in PLAYERS if p["id"] == pid), None)

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
    game["scores"][name][h] = val
    return game


def create_course(name: str, holes: int) -> dict:
    global NEXT_COURSE_ID
    clean = " ".join(str(name).split())
    holes = int(holes)
    c = {"id": NEXT_COURSE_ID, "name": clean, "holes": holes}
    COURSES.append(c)
    NEXT_COURSE_ID += 1
    return c

def list_courses() -> list[dict]:
    return COURSES

def get_course(course_id: int) -> dict | None:
    try:
        cid = int(course_id)
    except (TypeError, ValueError):
        return None
    return next((c for c in COURSES if c["id"] == cid), None)
