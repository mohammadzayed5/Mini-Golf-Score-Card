#This file creates/fetches games here using database (store.py)
from flask import Blueprint, request, jsonify
from store import create_game, list_games, get_game, update_game 

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

@bp.post("/games")
def post_game():
    #Create a game.
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    holes = data.get("holes", None)

    #Players can come either as list or as a CSV string
    players = _parse_players(
        data.get("players", data.get("players_csv"))
    )

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