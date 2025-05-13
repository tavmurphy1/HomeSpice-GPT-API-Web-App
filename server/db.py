from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Depends


# Extracting DB setup into it's own module

load_dotenv()

MONGO_URI = os.getenv("MONGODB_CONNECT_STRING")
DB_NAME   = os.getenv("MONGO_DB_NAME")

client = AsyncIOMotorClient(MONGO_URI)
db     = client[DB_NAME]

def get_db():
    return db
