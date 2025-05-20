import os
import json
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from bson import ObjectId
from datetime import datetime, timezone 
from pydantic import BaseModel
from db import get_db
from dependencies import get_current_user   # ensures ingredients operations are scoped to users
from models.recipe import RecipeCreate, RecipeOut, RecipeBase, format_recipe


router = APIRouter(tags=["recipes"])

# --- Recipe CRUD Endpoints ---


@router.post("/", response_model=dict, status_code=201)
async def create_recipe(
    recipe: RecipeCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Create and save new recipe with timestamps and ownership
    doc = recipe.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    # Attach ownership of save recipes to user
    doc["user_id"] = current_user["uid"]
    result = await db.recipes.insert_one(doc)
    new_doc = await db.recipes.find_one({"_id": result.inserted_id})

    return format_recipe(new_doc)


@router.get("/", response_model=List[dict])
async def list_recipes(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # List recipes owned by current user
    docs = await db.recipes.find(
        {"user_id": current_user["uid"]}
    ).to_list(length=None)
    # Convert each mongo doc to Pydantic model
    return [format_recipe({**doc, "_id": doc["_id"]}) for doc in docs]


@router.get("/{recipe_id}", response_model=dict)
async def get_recipe(
    recipe_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Retrieve a recipe by ID, ensuring user ownership
    doc = await db.recipes.find_one({
        "_id": ObjectId(recipe_id),
        "user_id": current_user["uid"]
    })
    if not doc:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return format_recipe(doc)


# DISCUSS WITH TEAM - DO WE WANT TO ALLOW USERS TO MANUALLY EDIT RECIPES
# OR ONLY SAVE, VIEW, AND DELETE?
@router.put("/{recipe_id}", response_model=dict)
async def update_recipe(
    recipe_id: str,
    recipe: RecipeCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Update existing recipe if owned by current user
    update_data = recipe.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc)
    result = await db.recipes.update_one(
        {
            "_id": ObjectId(recipe_id),
            "user_id": current_user["uid"]
        },
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    updated = await db.recipes.find_one({
        "_id": ObjectId(recipe_id),
        "user_id": current_user["uid"]
    })
    if not updated:
        raise HTTPException(status_code=404, detail="Recipe not found")
    updated["_id"] = str(updated["_id"])
    return format_recipe(updated)


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Ensures user ownership filter
    result = await db.recipes.delete_one({
        "_id": ObjectId(recipe_id),
        "user_id": current_user["uid"]
    })
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
