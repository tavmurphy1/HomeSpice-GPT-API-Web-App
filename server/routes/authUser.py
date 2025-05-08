from fastapi import Depends, HTTPException, status, APIRouter
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, EmailStr
from typing import Optional
from bson import ObjectId

router = APIRouter(tags=["user"])

"""
Creates user requiring an email and password and creates an ID in the database
"""
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserCreate):
    id: Optional[str]

def format_user(doc) -> dict:
    return {"id": str(doc["_id"]), "email": doc["email"], "password": doc["password"]}

# our main logic for creating a user and authenticate whether we already have it registered
@router.post("/create-account", response_model=UserInDB, status_code=201)
async def create_account(user: UserCreate):
    
    from db import get_db

    db: AsyncIOMotorDatabase = await get_db()
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(400, "Email already registered")
    result = await db.users.insert_one(user.dict())
    doc = await db.users.find_one({"_id": result.inserted_id})
    return format_user(doc)

@router.post("/login")
async def login(user: UserCreate):
    from main import get_db

    db: AsyncIOMotorDatabase = await get_db()
    doc = await db.users.find_one({"email": user.email})
    if not doc or doc["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"success": True, "message": "Logged in!"}