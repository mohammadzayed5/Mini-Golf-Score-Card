
from flask import Flask
import printscreen

app = Flask(__name__)
@app.route("/")

def main():
    return printscreen.printScreen()

if __name__ == "__main__":
    app.run(debug=True)



