
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from bson import ObjectId

from db import get_db

# Firebase Admin SDK import 
import firebase_admin.auth as admin_auth

router = APIRouter(tags=["user"])


# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserCreate):
    id: Optional[str]

class UserOut(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr

# -----------------------------
# Helper to format Mongo docs
# -----------------------------
def format_user(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "email": doc["email"],
        "password": doc["password"],
    }

# -----------------------------
# Create account
# -----------------------------
@router.post(
    "/create-account",
    response_model=UserInDB,
    status_code=status.HTTP_201_CREATED
)
async def create_account(
    user: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    result = await db.users.insert_one(user.model_dump())
    doc = await db.users.find_one({"_id": result.inserted_id})
    return format_user(doc)

# -----------------------------
# Login
# -----------------------------
@router.post("/login")
async def login(
    user: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    doc = await db.users.find_one({"email": user.email})
    if not doc or doc["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"success": True, "message": "Logged in!"}

# -----------------------------
# List all users (for GET /users/)
# -----------------------------
@router.get(
    "/users",
    response_model=List[UserOut],
    status_code=status.HTTP_200_OK
)
async def list_users(db: AsyncIOMotorDatabase = Depends(get_db)):
    docs = await db.users.find().to_list(None)
    return [{"_id": str(d["_id"]), "email": d["email"]} for d in docs]

# -----------------------------
# New: Save Firebase profile
# -----------------------------
bearer = HTTPBearer()

@router.post(
    "/profile",
    status_code=status.HTTP_201_CREATED,
    summary="Upsert Firebase user into MongoDB"
)
async def save_profile(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Expects Authorization: Bearer <Firebase ID token>.
    Verifies the token, extracts uid+email, then upserts into db.users.
    """
    # 1. Verify token
    try:
        decoded = admin_auth.verify_id_token(creds.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid auth token")

    uid   = decoded["uid"]
    email = decoded.get("email")

    # 2. Upsert by uid
    await db.users.update_one(
        {"uid": uid},
        {"$set": {"uid": uid, "email": email}},
        upsert=True
    )

    return {"status": "profile saved"}
