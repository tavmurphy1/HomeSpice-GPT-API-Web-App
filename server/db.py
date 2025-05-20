from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGODB_CONNECT_STRING")
DB_NAME = os.getenv("MONGO_DB_NAME", "homespice")

client: AsyncIOMotorClient = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())
db: AsyncIOMotorDatabase = client[DB_NAME]


def get_db() -> AsyncIOMotorDatabase:
    return db
