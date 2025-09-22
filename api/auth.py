from flask import Blueprint, request, jsonify, session
from store import create_user, authenticate_user

# Blueprint groups related routes, it is mounted under /api in app.py
bp = Blueprint("auth", __name__)


@bp.post("/register")
def register_route():
    """
    POST /api/register
    Creates a new user account
    
    Expected JSON body:
    {
        "username": "john",
        "password": "mypassword123"
    }
    
    Returns:
    - 201: User created successfully 
    - 400: Validation error (username exists, too short, etc.)
    """
    #Get JOSN data from request
    data = request.get_json(silent=True) or {}
    username = data.get("username", "")
    password = data.get("password", "")
    try:
        user = create_user(username=username, password=password)
        return jsonify(user), 201
    except ValueError as e:
        #create_user raises ValueError for validation errors
        return jsonify({"error": str(e)}),400

@bp.post("/login")  
def login_route():
    """
    POST /api/login
    Authenticates user credentials
    
    Expected JSON body:
    {
        "username": "john", 
        "password": "mypassword123"
    }
    
    Returns:
    - 200: Login successful
    - 401: Invalid username/password
    """
    #Get JSON data
    data = request.get_json(silent=True) or {}
    username = data.get("username", "")
    password = data.get("password", "")

    #Authenticate user
    user = authenticate_user(username, password)

    #Check result
    if user:
        #Success
        session['user_id'] = user['id']
        session['username'] = user['username']
        session['authenticated'] = True
        return jsonify({
            "message": "Login successful",
            "user": user
        }),200
    else:
        return jsonify({"error":"Invalid username or password"}),401


@bp.post("/logout")
def logout_route():
    """POST /api/logout - Clears user session"""

    # Clear all session data
    session.clear()

    return jsonify({"message": "Logout successful"}), 200

@bp.get("/me")
def me_route():
    """GET /api/me - Returns current user info from session"""

    # Check if user is logged in
    if 'user_id' in session and session.get('authenticated'):
        return jsonify({
            "user_id": session['user_id'],
            "username": session['username'],
            "authenticated": True
        }), 200
    else:
        return jsonify({"error": "Not authenticated"}), 401