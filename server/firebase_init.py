
import os
import firebase_admin
from firebase_admin import credentials

# Exact filename of your JSON key in this folder (points to)
# note that the filename MUST be precise to the json file
KEY_FILENAME = "homespice-ae7aa-firebase-adminsdk-fbsvc-883433c0ea.json"
KEY_PATH = os.path.join(os.path.dirname(__file__), KEY_FILENAME)

# Initialize the Admin SDK once
if not firebase_admin._apps:
    cred = credentials.Certificate(KEY_PATH)
    firebase_admin.initialize_app(cred)
