
from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

#Import blueprint (mini-aps)
from hello import bp as hello_bp
from games import bp as games_bp
from players import bp as players_bp
from courses import bp as courses_bp
from auth import bp as auth_bp




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


    #This enables Flask CORS for all /api/* routes so Iphone can call api
    CORS(app, resources={r"/api/*": {"origins": ["https://minigolfscoretracker.com", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "capacitor://localhost", "ionic://localhost", "http://localhost"], "supports_credentials":True}})

    return app



if __name__ == "__main__":
    #Allow: python ap.py
    app = create_app()
    print("API on http:/0.0.0.0:5001") #This is printing out the website that Flask runs on  
    app.run(debug=True, host="0.0.0.0", port=5001)



