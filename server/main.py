from flask import Flask, request
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os


load_dotenv()
app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGODB_CONNECT_STRING")

mongo = PyMongo(app)

@app.route('/')
def index():
    return 'Flask + PyMongo server is running!'


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
