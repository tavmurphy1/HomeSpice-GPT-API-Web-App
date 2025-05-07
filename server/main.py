"""
FastAPI entrypoint for HomeSpice:
 - Async MongoDB via Motor
 - Simple health & root endpoints
"""

import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from routes import ingredients

from routes.authUser import router as user_router
from routes.userList import router as users_router


load_dotenv()

MONGO_URI = os.getenv("MONGODB_CONNECT_STRING")
DB_NAME = os.getenv("MONGO_DB_NAME")

if not MONGO_URI:
    raise RuntimeError("Missing MONGODB_CONNECT_STRING")
if not DB_NAME:
    raise RuntimeError("Missing MONGO_DB_NAME")

# Set up MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

app = FastAPI(title="HomeSpice API")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check dependency
async def get_db():
    try:
        await db.command("ping")
        return db
    except Exception:
        raise HTTPException(status_code=503, detail="Database unavailable")

# Root endpoint
@app.get("/", tags=["root"])
async def read_root():
    return {"message": "FastAPI + Motor server is running!"}

# Health check endpoint
@app.get("/health", tags=["health"])
async def health(db=Depends(get_db)):
    return {"status": "ok"}

# Import ingredient routes
app.include_router(
    ingredients.router,
    prefix="/ingredients",
    tags=["ingredients"]
)

# import user routes
app.include_router(
    user_router,
    prefix="/user",
    tags=["user"]
)
# needed to find users 
app.include_router(
    users_router,
    prefix="/users",
    tags=["users"]
)