"""
Rate limiting for the API.

The limiter lives in its own module so blueprints (auth.py) can import it
without importing app.py, which would be a circular import.

Counters are kept in memory. That is correct for how this API runs on Render:
one gunicorn worker (`-k gthread -w 1`), so every request sees the same
counters. If the API ever runs more than one worker or instance, point
RATELIMIT_STORAGE_URI at Redis so the workers share one set of counters.
"""
import os

from flask import jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Applies to every route that does not set its own limit. High enough that a
# group scoring a round on one shared connection never reaches it.
DEFAULT_LIMITS = ["120 per minute"]

# Sign-up and login are the routes a stranger can call without a token, and
# both run PBKDF2, which is slow on purpose. Keep them much tighter.
REGISTER_LIMITS = "5 per minute; 20 per hour"
LOGIN_LIMITS = "10 per minute; 50 per hour"

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=DEFAULT_LIMITS,
    storage_uri=os.environ.get("RATELIMIT_STORAGE_URI", "memory://"),
    # Send X-RateLimit-* and Retry-After so the app can tell the user when to retry.
    headers_enabled=True,
)


def init_limits(app):
    """Attach the limiter to the app and return JSON, not HTML, on a 429."""
    limiter.init_app(app)

    @app.errorhandler(429)
    def too_many_requests(e):
        return jsonify({"error": "Too many attempts. Please wait a minute and try again."}), 429
