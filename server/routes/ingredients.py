import os
from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_CONNECT_STRING")
DB_NAME = os.getenv("MONGO_DB_NAME")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

router = APIRouter()


class Ingredient(BaseModel):
    name: str
    quantity: float


def format_ingredient(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "quantity": doc["quantity"],
    }


@router.post("/", response_model=dict)
async def create_ingredient(ingredient: Ingredient):
    print(f"POST /ingredients - Creating: {ingredient}")
    result = await db.ingredients.insert_one(ingredient.model_dump())
    created = await db.ingredients.find_one({"_id": result.inserted_id})
    print(f"Created ingredient with ID: {result.inserted_id}")
    return format_ingredient(created)


@router.get("/", response_model=List[dict])
async def get_all_ingredients():
    print("GET /ingredients - Fetching all ingredients")
    docs = await db.ingredients.find().to_list(100)
    return [format_ingredient(doc) for doc in docs]


@router.get("/{ingredient_id}", response_model=dict)
async def get_ingredient(ingredient_id: str):
    print(f"GET /ingredients/{ingredient_id}")
    try:
        ingredient = await db.ingredients.find_one(
            {"_id": ObjectId(ingredient_id)}
        )
    except Exception:
        raise HTTPException(400, detail="Invalid ID format")
    if not ingredient:
        raise HTTPException(404, detail="Ingredient not found")
    return format_ingredient(ingredient)


@router.put("/{ingredient_id}", response_model=dict)
async def update_ingredient(ingredient_id: str, updated: Ingredient):
    print(f"PUT /ingredients/{ingredient_id} - New data: {updated}")
    try:
        result = await db.ingredients.replace_one(
            {"_id": ObjectId(ingredient_id)}, updated.model_dump()
        )
    except Exception:
        raise HTTPException(400, detail="Invalid ID format")
    if result.modified_count == 0:
        raise HTTPException(404, detail="Ingredient not found or not changed")
    updated_doc = await db.ingredients.find_one(
        {"_id": ObjectId(ingredient_id)}
    )
    return format_ingredient(updated_doc)


@router.delete("/{ingredient_id}", status_code=204)
async def delete_ingredient(ingredient_id: str):
    print(f"DELETE /ingredients/{ingredient_id}")
    try:
        result = await db.ingredients.delete_one(
            {"_id": ObjectId(ingredient_id)}
        )
    except Exception:
        raise HTTPException(400, detail="Invalid ID format")
    if result.deleted_count == 0:
        raise HTTPException(404, detail="Ingredient not found")
    print(f"Deleted ingredient {ingredient_id}")
