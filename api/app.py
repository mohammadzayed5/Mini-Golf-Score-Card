
from flask import Flask
from flask_cors import CORS

#Import blueprint (mini-aps)
from hello import bp as hello_bp
from games import bp as games_bp
from players import bp as players_bp
from courses import bp as courses_bp




#This allows iphone to call API

def create_app() -> Flask:
    #Build and return the Flask app
    app = Flask(__name__)
    #Mount both blueprints under /api
    app.register_blueprint(hello_bp, url_prefix="/api")
    app.register_blueprint(games_bp, url_prefix="/api")
    app.register_blueprint(players_bp, url_prefix="/api")
    app.register_blueprint(courses_bp, url_prefix="/api")


    #This enables Flask CORS for all /api/* routes so Iphone can call api
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    return app



if __name__ == "__main__":
    #Allow: python ap.py
    app = create_app()
    print("API on http:/0.0.0.0:5001") #This is printing out the website that Flask runs on  
    app.run(debug=True, host="0.0.0.0", port=5001)



