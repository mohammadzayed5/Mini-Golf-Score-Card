from flask import Blueprint, request, jsonify
import store


#Blueprint groups related routes, it is mounted under /api in app.py
bp = Blueprint("courses", __name__)


@bp.get("/courses")
def list_courses_route():
    #Get /api/courses
    #Returns the current list of courses
    # [{"id": int, "name": str, "wins" : int}, ...]
    courses = store.list_courses()
    return jsonify(courses),200

@bp.post("/courses")
def create_course_route():
    #POST /api/courses
    #Creates a new player and resturn it with 201 created.
    #global NEXT_PLAYER_ID
    #Parse JSON safely, if bosy isn't valid, we get {} instead of crashing
    data = request.get_json(silent=True) or {}
    name = data.get("name", "")
    holes = data.get("holes")
    try:
        holes = int(holes)
    except (TypeError,ValueError):
        return jsonify({"error": "holes must be an integer"}), 400
    if holes <= 0:
        return jsonify({"error": "holes must be more than 0"}), 400
    course = store.create_course(name=name, holes=holes)
    return jsonify(course), 201

