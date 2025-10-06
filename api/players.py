from flask import Blueprint, request, jsonify
from store import create_player as store_create_player, list_players as store_list_players, delete_player as store_delete_player
from jwt_utils import optional_token


#Blueprint groups related routes, it is mounted under /api in app.py
bp = Blueprint("players", __name__)


@bp.get("/players")
@optional_token
def list_players_route(current_user):
    """
    Get /api/players
    Returns players for current user (if logged in) or empty list for guests
    """
    if current_user:
        # Logged in - return their players
        user_id = current_user['user_id']
        return jsonify(store_list_players(user_id=user_id))
    else:
        # Guest mode - return empty list (frontend handles guest data)
        return jsonify([])

@bp.post("/players")
@optional_token
def create_player_route(current_user):
    """POST /api/players - Creates a new player"""
    data = request.get_json(silent=True) or {}
    name = data.get("name", "")

    if current_user:
        # Logged in - save to database
        user_id = current_user['user_id']
        try:
            player = store_create_player(name, user_id=user_id)
            return jsonify(player), 201
        except ValueError as e:
            return jsonify({"errors": {"name": str(e)}}), 400
    else:
        # Guest mode - return mock data (frontend handles storage)
        if not name or not name.strip():
            return jsonify({"errors": {"name": "Name is required"}}), 400
        return jsonify({
            "id": None,
            "name": name.strip(),
            "user_id": None,
            "wins": 0,
            "created_at": None
        }), 201

@bp.delete("/players/<int:player_id>")
@optional_token
def delete_player_route(current_user, player_id):
    """DELETE /api/players/:id - Delete a player"""
    if current_user:
        # Logged in - delete from database
        user_id = current_user['user_id']
        if store_delete_player(player_id, user_id=user_id):
            return '', 204
        else:
            return jsonify({"error": "Player not found"}), 404
    else:
        # Guest mode - return success (frontend handles deletion)
        return '', 204

