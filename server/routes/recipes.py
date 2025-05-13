import os
import json
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from bson import ObjectId
from datetime import datetime, timezone 
from pydantic import BaseModel
from db import get_db
from models.recipe import RecipeCreate, RecipeOut, RecipeBase


router = APIRouter(tags=["recipes"])

# --- Recipe CRUD Endpoints ---

@router.post("/", response_model=RecipeOut, status_code=201)
async def create_recipe(
    recipe: RecipeCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Create and save new recipe in mongoDB
    doc = recipe.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    # TODO: attach `doc["user_id"] = current_user.id` once auth is added
    result = await db.recipes.insert_one(doc)
    new_doc = await db.recipes.find_one({"_id": result.inserted_id})
    new_doc["_id"] = str(new_doc["_id"])
    return new_doc

@router.get("/", response_model=List[RecipeOut])
async def list_recipes(
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # List all recipes
    # TODO: filter by user_id once scoped
    docs = await db.recipes.find().to_list(length=None)
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@router.get("/{recipe_id}", response_model=RecipeOut)
async def get_recipe(
    recipe_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Retrieve a recipe by ID
    doc = await db.recipes.find_one({"_id": ObjectId(recipe_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Recipe not found")
    # TODO: verify doc["user_id"] == current_user.id once auth is added
    doc["_id"] = str(doc["_id"])
    return doc

@router.put("/{recipe_id}", response_model=RecipeOut)
async def update_recipe(
    recipe_id: str,
    recipe: RecipeCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Update existing recipe. created_at stays static.
    update_data = recipe.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc)
    # TODO: ensure ownership filter when auth is in place
    result = await db.recipes.update_one(
        {"_id": ObjectId(recipe_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    updated = await db.recipes.find_one({"_id": ObjectId(recipe_id)})
    return updated

@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # TODO: ensure ownership filter when auth is in place
    result = await db.recipes.delete_one({"_id": ObjectId(recipe_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return None

# --- GPT Recipe Generation Endpoint ---

class RecipeGenIn(BaseModel):
    ingredients: List[str]

@router.post("/generate", response_model=RecipeBase)
async def generate_recipe(
    req: RecipeGenIn,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # TODO: Placeholder for build prompt for GPT.
    prompt = (
        "You are a world-class chef. "
        f"Create a JSON-formatted recipe (title, description, ingredients, steps, "
        f"prep_time, cook_time, servings, image_url) using only these ingredients: "
        + ", ".join(req.ingredients)
    )

    # TODO: integrate with OpenAI SDK
    # openai.api_key = os.getenv("OPENAI_API_KEY")
    # resp = await openai.ChatCompletion.acreate(...)
    # try:
    #     recipe_data = json.loads(resp.choices[0].message.content)
    # except JSON errors:
    #     raise HTTPException(500, "GPT response was not valid JSON")

    # Placeholder: return an empty recipe structure
    return {
        "title": "",
        "description": "",
        "ingredients": req.ingredients,
        "steps": [],
        "prep_time": 0,
        "cook_time": 0,
        "servings": 1,
        "image_url": None
    }
