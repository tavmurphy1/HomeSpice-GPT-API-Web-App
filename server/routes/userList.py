"""
FastAPI router to list all registered users
"""

from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId

# go to 
# http://127.0.0.1:8080/users/ 
# to properly see if your user is being generated.

# Pydantic output model to be used by datagase
class UserOut(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr
    password: str  # plain-text for now (will add hashing later in the future)

router = APIRouter(tags=["users"])

@router.get("/", response_model=List[UserOut])
async def list_users():
    
    from main import get_db
    db = await get_db()

    try:
        docs = await db.users.find().to_list(length=None)
        return [
            {"_id": str(doc["_id"]), "email": doc["email"], "password": doc["password"]}
            for doc in docs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
