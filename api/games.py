#This file creates/fetches games here using database (store.py)
#Data storage is in store.py


from flask import Blueprint, request, jsonify
from store import create_game, list_games, get_game, update_game, get_player, set_score, update_player_wins, delete_game, decrement_player_wins
from jwt_utils import optional_token


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
@optional_token
def post_game(current_user):
    """POST /api/games - Create a new game"""
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

    if current_user:
        # Logged in - save to database
        user_id = current_user['user_id']
        game = create_game(name=name, holes=holes, players=players, user_id=user_id)
        return jsonify(game), 201
    else:
        # Guest mode - return mock game (frontend handles storage)
        scores = {player: [None] * holes for player in players}
        return jsonify({
            "id": None,
            "name": name,
            "holes": holes,
            "players": players,
            "scores": scores,
            "user_id": None,
            "created_at": None
        }), 201

@bp.get("/games")
@optional_token
def get_games(current_user):
    """GET /api/games - List all games for current user"""
    if current_user:
        # Logged in - return their games
        user_id = current_user['user_id']
        return jsonify(list_games(user_id=user_id))
    else:
        # Guest mode - return empty list (frontend handles guest data)
        return jsonify([])

@bp.get("/games/<int:game_id>")
@optional_token
def get_games_by_id(current_user, game_id: int):
    """GET /api/games/<id> - Get a single game"""
    game = get_game(game_id)
    if not game:
        return jsonify(error="Not found"), 404
    return jsonify(game)


@bp.patch("/games/<int:game_id>")
@optional_token
def patch_game(current_user, game_id: int):
    """PATCH /api/games/<id> - Update a game"""
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

    if current_user:
        # Logged in - update in database
        game = update_game(game_id, name=name, holes=holes, players=players)
        if not game:
            return jsonify({"error": "Not found"}), 404
        return jsonify(game)
    else:
        # Guest mode - return success (frontend handles updates)
        return jsonify({"success": True}), 200

@bp.patch("/games/<int:game_id>/score")
@optional_token
def patch_score(current_user, game_id: int):
    """PATCH /api/games/<id>/score - Update a score for a player"""
    data = request.get_json(silent=True) or {}
    player = data.get("player")
    hole = data.get("hole")            # 1-based
    score = data.get("score", None)    # allow null to clear
    try:
        hi = int(hole) - 1
    except (TypeError, ValueError):
        return jsonify({"errors": {"hole": "Hole must be an integer 1..N"}}), 400

    if current_user:
        # Logged in - update in database
        updated = set_score(game_id, player, hi, score)
        if not updated:
            return jsonify({"error": "Invalid game/player/hole"}), 400
        return jsonify(updated)
    else:
        # Guest mode - return success (frontend handles scoring)
        return jsonify({"success": True}), 200

@bp.post("/games/<int:game_id>/finish")
@optional_token
def finish_game(current_user, game_id: int):
    """POST /api/games/<id>/finish - Finish a game and record wins"""
    #Get the game
    game = get_game(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404
    #Calculate winners (same logic as Results.jsx)
    totals = []
    for player in game.get("players", []):
        scores = game.get("scores", {}).get(player, [])
        total = sum(score for score in scores if isinstance(score, int))
        totals.append({"player": player, "total": total})

    if not totals:
        return jsonify({"error": "No players found"}), 400

    # Sort by lowest score (mini golf)
    totals.sort(key=lambda x: x["total"])
    best_score = totals[0]["total"]

    # Find all winners (handle ties)
    winners = [t["player"] for t in totals if t["total"] == best_score]

    if current_user:
        # Logged in - update wins in database
        user_id = current_user['user_id']
        for winner in winners:
            update_player_wins(winner, user_id)

    return jsonify({
        "winners": winners,
        "best_score": best_score,
        "final_standings": totals
    })

@bp.delete("/games/<int:game_id>")
@optional_token
def delete_game_route(current_user, game_id: int):
    """DELETE /api/games/<id> - Delete a game and update win counts"""
    # Get the game first to calculate winners
    game = get_game(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    if current_user:
        # Calculate winners to decrement their win counts
        totals = []
        for player in game.get("players", []):
            scores = game.get("scores", {}).get(player, [])
            total = sum(score for score in scores if isinstance(score, int))
            totals.append({"player": player, "total": total})

        if totals:
            # Sort by lowest score (mini golf)
            totals.sort(key=lambda x: x["total"])
            best_score = totals[0]["total"]
            # Find all winners (handle ties)
            winners = [t["player"] for t in totals if t["total"] == best_score]

            # Decrement wins for each winner
            user_id = current_user['user_id']
            for winner in winners:
                decrement_player_wins(winner, user_id)

        # Delete the game
        if delete_game(game_id, user_id):
            return '', 204
        else:
            return jsonify({"error": "Failed to delete game"}), 500
    else:
        # Guest mode - return success (frontend handles deletion)
        return '', 204