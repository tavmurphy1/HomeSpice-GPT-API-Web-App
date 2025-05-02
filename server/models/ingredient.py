from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from bson import ObjectId
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()
# Load environment variables from .env file
MONGO_URI = os.getenv("MONGODB_CONNECT_STRING")
DB_NAME = os.getenv("MONGO_DB_NAME")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

router = APIRouter()


# Pydantic model
class Ingredient(BaseModel):
    name: str
    quantity: float = Field(
        ...,
        gt=0,
        description="Quantity must be greater than 0"
    )


# Helper to format MongoDB documents
def format_ingredient(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "quantity": doc["quantity"],
    }


# ROUTES
@router.post("/")
async def create_ingredient(ingredient: Ingredient):
    result = await db.ingredients.insert_one(ingredient.model_dump())
    created = await db.ingredients.find_one({"_id": result.inserted_id})
    return format_ingredient(created)

# Get all ingredients
@router.get("/", response_model=List[dict])
async def get_all_ingredients():
    docs = await db.ingredients.find().to_list(100)
    return [format_ingredient(doc) for doc in docs]

# Get ingredient by ID
@router.get("/{ingredient_id}")
async def get_ingredient(ingredient_id: str):
    ingredient = await db.ingredients.find_one(
        {"_id": ObjectId(ingredient_id)}
    )
    if not ingredient:
        raise HTTPException(404, detail="Ingredient not found")
    return format_ingredient(ingredient)

# Update ingredient
@router.put("/{ingredient_id}")
async def update_ingredient(ingredient_id: str, updated: Ingredient):
    result = await db.ingredients.replace_one(
        {"_id": ObjectId(ingredient_id)},
        updated.model_dump()
    )
    if result.modified_count == 0:
        raise HTTPException(404, detail="Ingredient not found or not changed")
    updated_doc = await db.ingredients.find_one(
        {"_id": ObjectId(ingredient_id)}
    )
    return format_ingredient(updated_doc)

# Delete ingredient
@router.delete("/{ingredient_id}", status_code=204)
async def delete_ingredient(ingredient_id: str):
    result = await db.ingredients.delete_one({"_id": ObjectId(ingredient_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, detail="Ingredient not found")
