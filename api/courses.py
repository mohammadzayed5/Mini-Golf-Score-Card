from flask import Blueprint, request, jsonify
import store
from jwt_utils import optional_token


#Blueprint groups related routes, it is mounted under /api in app.py
bp = Blueprint("courses", __name__)


@bp.get("/courses")
@optional_token
def list_courses_route(current_user):
    """
    Get /api/courses
    Returns courses for current user (if logged in) or empty list for guests
    """
    if current_user:
        # Logged in - return their courses
        user_id = current_user['user_id']
        courses = store.list_courses(user_id=user_id)
        return jsonify(courses), 200
    else:
        # Guest mode - return empty list (frontend handles guest data)
        return jsonify([]), 200

@bp.post("/courses")
@optional_token
def create_course_route(current_user):
    """POST /api/courses - Creates a new course"""
    data = request.get_json(silent=True) or {}
    name = data.get("name", "")
    holes = data.get("holes")

    try:
        holes = int(holes)
    except (TypeError, ValueError):
        return jsonify({"error": "holes must be an integer"}), 400

    if holes <= 0:
        return jsonify({"error": "holes must be more than 0"}), 400

    if current_user:
        # Logged in - save to database
        user_id = current_user['user_id']
        course = store.create_course(name=name, holes=holes, user_id=user_id)
        return jsonify(course), 201
    else:
        # Guest mode - return mock data (frontend handles storage)
        return jsonify({
            "id": None,
            "name": name,
            "holes": holes,
            "user_id": None,
            "created_at": None
        }), 201

@bp.delete("/courses/<int:course_id>")
@optional_token
def delete_course_route(current_user, course_id):
    """DELETE /api/courses/:id - Delete a course"""
    if current_user:
        # Logged in - delete from database
        user_id = current_user['user_id']
        if store.delete_course(course_id, user_id=user_id):
            return '', 204
        else:
            return jsonify({"error": "Course not found"}), 404
    else:
        # Guest mode - return success (frontend handles deletion)
        return '', 204

