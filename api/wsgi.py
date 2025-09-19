# wsgi.py
from app import create_app

# Gunicorn will import this variable
app = create_app()
