from flask import Blueprint, request, jsonify 
from store import create_user, authenticate_user
from jwt_utils import create_token, decode_token, token_required

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
        #Create JWT token for the new user
        token = create_token(user['id'], user['username'])
        return jsonify({
              "message": "Registration successful",
              "token": token,
              "user": {
                  "id": user['id'],
                  "username": user['username']
              }
          }), 201
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
        # Create JWT token
        token = create_token(user['id'], user['username'])

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user['id'],
                "username": user['username']
            }
        }), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


@bp.post("/logout")
def logout_route():
    """POST /api/logout - Clears user session"""

    

    return jsonify({"message": "Logout successful"}), 200

@bp.get("/me")
@token_required
def me_route(current_user):
    """GET /api/me - Returns current user info from JWT token"""
    return jsonify({
        "user_id": current_user['user_id'],
        "username": current_user['username'],
        "authenticated": True
    }), 200