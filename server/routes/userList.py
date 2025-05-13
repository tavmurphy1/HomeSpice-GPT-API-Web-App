"""
FastAPI router to list all registered users
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from db import get_db

# go to 
# http://127.0.0.1:8080/users/ 
# now only shows ID not password
# to properly see if your user is being generated.

# Pydantic output model to be used by datagase
class UserOut(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr


router = APIRouter(tags=["users"])


@router.get("/", response_model=List[UserOut])
async def list_users(db: AsyncIOMotorDatabase = Depends(get_db)):

    # now instead of password, it returns email and ID from database
    # firebase handles the password hashing and storing
    try:
        docs = await db.users.find().to_list(length=None)
        return [
            {"_id": str(doc["_id"]), "email": doc["email"]}
            for doc in docs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
