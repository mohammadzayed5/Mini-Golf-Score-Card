
from flask import Flask
from hello import bp as hello_bp
from games import bp as games_bp


def create_app() -> Flask:
    #Build and return the Flask app
    app = Flask(__name__)
    #Mount both blueprints under /api
    app.register_blueprint(hello_bp, url_prefix="/api")
    app.register_blueprint(games_bp, url_prefix="/api")

    return app



if __name__ == "__main__":
    #Allow: python ap.py
    app = create_app()
    print("API on http://127.0.0.1:5001") #This is printing out the website that Flask runs on  
    app.run(debug=True, port=5001)



