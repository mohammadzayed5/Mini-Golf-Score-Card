from flask import Blueprint, request, jsonify, session
from store import create_player as store_create_player, list_players as store_list_players, delete_player as store_delete_player



#Blueprint groups related routes, it is mounted under /api in app.py
bp = Blueprint("players", __name__)


@bp.get("/players")
def list_players_route():
    """
    Get /api/players
    Returns players for current user (if logged in) or guest players (if not)
    """
    # Check if user is logged in
    if 'user_id' in session and session.get('authenticated'):
        user_id = session['user_id']  # Logged in - get their players
        return jsonify(store_list_players(user_id=user_id))
    else:
        # Guest mode - return empty list (data managed in frontend)
        return jsonify([])

@bp.post("/players")
def create_player_route():
    #POST /api/players
    #Creates a new player and resturn it with 201 created.
    #global NEXT_PLAYER_ID
    #Parse JSON safely, if bosy isn't valid, we get {} instead of crashing
    data = request.get_json(silent=True) or {}
    name = data.get("name", "")
    if 'user_id' in session and session.get('authenticated'):
        user_id = session['user_id'] #Logged in player belongs to them
        try:
            player = store_create_player(name, user_id=user_id)
        except ValueError as e:
            return jsonify({"errors": {"name": str(e)}}), 400
        return jsonify(player), 201
    else:
        # Guest mode - return player data but don't save to database
        if not name or not name.strip():
            return jsonify({"errors": {"name": "Name is required"}}), 400
        return jsonify({
            "id": None,  # No database ID for guest data
            "name": name.strip(),
            "user_id": None,
            "created_at": None
        }), 201

@bp.delete("/players/<int:player_id>")
def delete_player_route(player_id):
    """DELETE /api/players/:id - Delete a player"""
    if 'user_id' in session and session.get('authenticated'):
        user_id = session['user_id']
        if store_delete_player(player_id, user_id=user_id):
            return '', 204  # No content on successful delete
        else:
            return jsonify({"error": "Player not found"}), 404
    else:
        # Guest mode - return success but don't actually delete anything
        return '', 204

