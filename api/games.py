#This file creates/fetches games here using database (store.py)
#Data storage is in store.py


from flask import Blueprint, request, jsonify
from store import create_game, list_games, get_game, update_game, get_player, set_score


bp = Blueprint("games", __name__)

def _parse_players(value) -> list[str]:
    #Accepts list, string, None, returns a cleaned list of non-empty names
    if value is None:
        return []
    if isinstance(value,list):
        raw = value
    elif isinstance(value, str):
        raw = value.split(",")
    else:
        raw = [value]

    # Clean + de-dup (preserve order)
    seen = set()
    cleaned = []
    for p in raw:
        name = str(p).strip()
        if name and name not in seen:
            seen.add(name)
            cleaned.append(name)
    return cleaned


def _names_from_ids(ids) -> list[str]:
    #Convert a list of player ids (as ints or string) insto a list of player NAMES
    #Looks up data from players.PLAYERS
    #Build a quick lookup dict id->name from current players list.
    names, seen = [], set()
    for v in (ids or []):
        try:
            pid = int(v)
        except (TypeError, ValueError):
            #skip values that aren't valid input
            continue
        #Map ids -> names, skipping unknown ids.
        p = get_player(pid)
        if p:
            n = p["name"]
            if n not in seen:
                seen.add(n)
                names.append(n)
    return names



@bp.post("/games")
def post_game():
    #Create a game.
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    holes = data.get("holes", None)

    #Players can come either as list or as a CSV string
    #Option A: explicit names (list or CSV string)
    players = _parse_players(data.get("players", data.get("players_csv")))

    #Option B: ids-> names (only if no names provided)
    if not players and "playerIds" in data:
        players = _names_from_ids(data.get("playerIds"))
    
    #Validate inputs
    errors = {}
    if not name:
        errors["name"] = "Game name is required."
    try:
        holes = int(holes)
        if not (1 <= holes <= 36):
            errors["holes"] = "Holes must be between 1 and 36."
    except (TypeError, ValueError):
        errors["holes"] = "Holes must be an integer between 1 and 36."

    if errors:
        return jsonify({"errors": errors}), 400

    #Delegate to store.py to create and return the game record
    #store.create_game sets up "scores" dict keyed by player names.
    game = create_game(name=name, holes=holes, players=players)
    return jsonify(game), 201

@bp.get("/games")
def get_games():
    #Get /api/games -> list of games/
    return jsonify(list_games())

@bp.get("/games/<int:game_id>")
def get_games_by_id(game_id: int):
    #Get /api/games/<id> -> single game or error/
    game = get_game(game_id)
    if not game:
        return jsonify(error="Not found"), 404
    return jsonify(game)


@bp.patch("/games/<int:game_id>")
def patch_game(game_id: int):
    #Sends only field you want to change
    data = request.get_json(silent=True) or {}
    name = data.get("name", None)
    holes = data.get("holes", None)
    players = None
    if "players" in data or "players_csv" in data:
        players = _parse_players(data.get("players", data.get("players_csv")))

    # Validate holes if given
    if holes is not None:
        try:
            holes = int(holes)
            if not (1 <= holes <= 36):
                return jsonify({"errors": {"holes": "Holes must be 1..36"}}), 400
        except (TypeError, ValueError):
            return jsonify({"errors": {"holes": "Holes must be an integer"}}), 400

    game = update_game(game_id, name=name, holes=holes, players=players)
    if not game:
        return jsonify({"error": "Not found"}), 404
    return jsonify(game)

@bp.patch("/games/<int:game_id>/score")
def patch_score(game_id: int):
    data = request.get_json(silent=True) or {}
    player = data.get("player")
    hole = data.get("hole")            # 1-based
    score = data.get("score", None)    # allow null to clear
    try:
        hi = int(hole) - 1
    except (TypeError, ValueError):
        return jsonify({"errors": {"hole": "Hole must be an integer 1..N"}}), 400
    updated = set_score(game_id, player, hi, score)
    if not updated:
        return jsonify({"error": "Invalid game/player/hole"}), 400
    return jsonify(updated)