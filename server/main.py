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


load_dotenv()
MONGO_URI = os.getenv("MONGODB_CONNECT_STRING")
if not MONGO_URI:
    raise RuntimeError("Missing MONGODB_CONNECT_STRING")

# Async client & DB handle
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_default_database()


async def get_db():
    try:
        await db.command("ping")
        return db
    except Exception:
        raise HTTPException(503, "Database unavailable")

app = FastAPI(title="HomeSpice API")


# To allow React dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["root"])
async def read_root():
    return {"message": "FastAPI + Motor server is running!"}


@app.get("/health", tags=["health"])
async def health(db=Depends(get_db)):
    return {"status": "ok"}