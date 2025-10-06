import jwt
from datetime import datetime, timedelta
from flask import request, jsonify
from functools import wraps

#Secret key for sigining tokens (same one from app.py)
SECRET_KEY = 'minigolf-secret-key-2004'

def create_token(user_id, username):
    #Create a JWT token for a user
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.utcnow() + timedelta(days=1),  # Token expires in 24 hours
        'iat': datetime.utcnow()  # Issued at time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token
def decode_token(token):
    #Decode and validate a JWT token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None #Toke expired
    except jwt.InvalidTokenError:
        return None #Invalid token
    
def token_required(f):
    """Decorator to protect routes that require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        #Check if Authorization header exists
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            #Format should be: "Bearer <token>"
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        #Decode and validate token
        payload = decode_token(token)
        if not payload:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        #Pass user info to the route function
        return f(current_user=payload, *args, **kwargs)
    return decorated

def optional_token(f):
    """Decorator for routes that work for both guests and authenticated users"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        current_user = None

        #Check if Authorization header exists
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            #Format should be: "Bearer <token>"
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
                #Decode and validate token
                payload = decode_token(token)
                if payload:
                    current_user = payload

        #Pass user info to the route function (None if guest)
        return f(current_user=current_user, *args, **kwargs)
    return decorated