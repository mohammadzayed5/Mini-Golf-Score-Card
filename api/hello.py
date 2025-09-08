#This file will confirm if API is reachable from Ract/browser

from flask import Blueprint, jsonify


#Blueprint groups related routes, it is mounted under /api in app.py
bp = Blueprint("hello", __name__)

@bp.get("/hello")
def hello():
    #Get /api/hello -> {"message": "..."}
    #Used by you/React to verify the backend is running
    return jsonify(message="Hello from Flask!")