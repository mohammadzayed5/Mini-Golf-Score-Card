
from flask import Flask, Response
from flask_cors import CORS
import os
import threading
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

#Import blueprint (mini-aps)
from hello import bp as hello_bp
from games import bp as games_bp
from players import bp as players_bp
from courses import bp as courses_bp
from auth import bp as auth_bp
from database import init_db

# Runs init_db() at most once per process, off the request path so a slow
# cross-region CREATE TABLE round-trip doesn't kill worker startup.
_init_lock = threading.Lock()
_init_done = False

def _init_db_once_in_background():
    def run():
        global _init_done
        with _init_lock:
            if _init_done:
                return
            try:
                init_db()
                _init_done = True
            except Exception as e:
                print(f"init_db failed (will retry on next boot): {e}")
    threading.Thread(target=run, daemon=True).start()




#This allows iphone to call API

def create_app() -> Flask:
    #Build and return the Flask app
    app = Flask(__name__)
    #Secret key for session encryption (loaded from environment variable)
    app.secret_key = os.environ.get('FLASK_SECRET_KEY')
    if not app.secret_key:
        raise ValueError("FLASK_SECRET_KEY environment variable is not set. Please check your .env file.")

    #Detect if running on Render
    is_production = os.environ.get('RENDER') is not None or os.environ.get('FLASK_ENV') == 'production'
    #Session cookie configuration for cross-origin requests
    app.config['SESSION_COOKIE_SECURE'] = is_production #True on Render (HTTPS)
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None' if is_production else 'Lax'
    app.config['SESSION_COOKIE_DOMAIN'] = '.minigolfscoretracker.com' if is_production else None
    app.config['PERMANENT_SESSION_LIFETIME'] = 86400
    #Mount both blueprints under /api
    app.register_blueprint(hello_bp, url_prefix="/api")
    app.register_blueprint(games_bp, url_prefix="/api")
    app.register_blueprint(players_bp, url_prefix="/api")
    app.register_blueprint(courses_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")

    # Health check for uptime pings. Touches the DB with a trivial query so the
    # 10-min cron keeps Render's dyno warm AND Turso's DB active.
    @app.route('/api/health')
    def health():
        try:
            from database import get_db
            with get_db() as conn:
                conn.cursor().execute("SELECT 1")
            return {"ok": True, "db": True}, 200
        except Exception:
            return {"ok": True, "db": False}, 200

    # Serve app-ads.txt for AdMob verification
    @app.route('/app-ads.txt')
    def app_ads():
        content = "google.com, pub-5108646735858325, DIRECT, f08c47fec0942fa0"
        return Response(content, mimetype='text/plain')

    #This enables Flask CORS for all /api/* routes so Iphone can call api
    CORS(app, resources={r"/api/*": {"origins": ["https://minigolfscoretracker.com", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "capacitor://localhost", "ionic://localhost", "http://localhost"], "supports_credentials":True}})

    # Kick off schema init in the background — first request may see the DB
    # a moment before tables exist, but that's fine for CREATE IF NOT EXISTS.
    _init_db_once_in_background()

    return app



if __name__ == "__main__":
    #Allow: python ap.py
    app = create_app()
    print("API on http:/0.0.0.0:5001") #This is printing out the website that Flask runs on  
    app.run(debug=True, host="0.0.0.0", port=5001)



