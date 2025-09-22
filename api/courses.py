from flask import Blueprint, request, jsonify, session
import store


#Blueprint groups related routes, it is mounted under /api in app.py
bp = Blueprint("courses", __name__)


@bp.get("/courses")
def list_courses_route():
    """
    Get /api/courses
    Returns courses for current user (if logged in) or guest courses (if not)
    """
    # Check if user is logged in
    if 'user_id' in session and session.get('authenticated'):
        user_id = session['user_id']  # Logged in - get their courses
        courses = store.list_courses(user_id=user_id)
        return jsonify(courses), 200
    else:
        # Guest mode - return empty list (data managed in frontend)
        return jsonify([]), 200

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
    if 'user_id' in session and session.get('authenticated'):
        user_id = session['user_id']  # Logged in - course belongs to them
        course = store.create_course(name=name, holes=holes, user_id=user_id)
        return jsonify(course), 201
    else:
        # Guest mode - return course data but don't save to database
        return jsonify({
            "id": None,  # No database ID for guest data
            "name": name,
            "holes": holes,
            "user_id": None,
            "created_at": None
        }), 201

@bp.delete("/courses/<int:course_id>")
def delete_course_route(course_id):
    """DELETE /api/courses/:id - Delete a course"""
    if 'user_id' in session and session.get('authenticated'):
        user_id = session['user_id']
        if store.delete_course(course_id, user_id=user_id):
            return '', 204  # No content on successful delete
        else:
            return jsonify({"error": "Course not found"}), 404
    else:
        # Guest mode - return success but don't actually delete anything
        return '', 204

