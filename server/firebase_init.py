
import os
import firebase_admin
from firebase_admin import credentials

# Exact filename of your JSON key in this folder (points to)
# note that the filename MUST be precise to the json file
# if you are using your own dashboard with FireBase replace .json file and
# ensure json is under Server folder
KEY_FILENAME = "homespice-ae7aa-44106519bcde.json"
KEY_PATH = os.path.join(os.path.dirname(__file__), KEY_FILENAME)

if not firebase_admin._apps:
    cred = credentials.Certificate(KEY_PATH)
    firebase_admin.initialize_app(cred)
