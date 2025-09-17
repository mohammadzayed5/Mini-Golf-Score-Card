from flask import Blueprint, request, jsonify
from store import create_player as store_create_player, list_players as store_list_players



#Blueprint groups related routes, it is mounted under /api in app.py
bp = Blueprint("players", __name__)


@bp.get("/players")
def list_players_route():
    #Get /api/players
    #Returns the current list of players
    # [{"id": int, "name": str, "wins" : int}, ...]
    return jsonify(store_list_players())

@bp.post("/players")
def create_player_route():
    #POST /api/players
    #Creates a new player and resturn it with 201 created.
    #global NEXT_PLAYER_ID
    #Parse JSON safely, if bosy isn't valid, we get {} instead of crashing
    data = request.get_json(silent=True) or {}
    name = data.get("name", "")
    try:
        player = store_create_player(name)
    except ValueError as e:
        return jsonify({"errors": {"name": str(e)}}), 400
    return jsonify(player), 201

