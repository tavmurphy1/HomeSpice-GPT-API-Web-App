import json
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from bson import ObjectId
from datetime import datetime, timezone 
from pydantic import BaseModel, ValidationError
from db import get_db
from dependencies import get_current_user
from models.recipe import RecipeCreate, RecipeOut, RecipeBase
from models.ingredient import Ingredient
from services.gptClient import generate_recipe_from_ingredients

REQUIRED_RECIPE_FIELDS = {
    "title", "description", "ingredients", "steps",
    "prep_time", "cook_time", "servings", "image_url"
}
ERR_MISSING_FIELDS = "GPT response is missing one or more required fields."
ERR_VALIDATION_FAILED = "GPT response failed schema validation."
ERR_INVALID_JSON = "GPT response was not valid JSON."
ERR_INTERNAL_ERROR = "Internal error: {}"

router = APIRouter(tags=["recipes"])

# --- Recipe CRUD Endpoints ---
@router.post("/", response_model=RecipeOut, status_code=201)
async def create_recipe(
    recipe: RecipeCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    doc = recipe.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    doc["user_id"] = current_user["uid"]

    result = await db.recipes.insert_one(doc)
    new_doc = await db.recipes.find_one({"_id": result.inserted_id})
    new_doc["_id"] = str(new_doc["_id"])

    return RecipeOut.from_mongo(new_doc).model_dump(by_alias=True, mode="json")


@router.get("/", response_model=List[RecipeOut])
async def list_recipes(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    docs = await db.recipes.find({"user_id": current_user["uid"]}).to_list(length=None)

    for doc in docs:
        doc["_id"] = str(doc["_id"])
        for ing in doc.get("ingredients", []):
            ing["quantity"] = float(ing["quantity"])

    return [RecipeOut.from_mongo(doc).model_dump(by_alias=True, mode="json") for doc in docs]


@router.get("/{recipe_id}", response_model=RecipeOut)
async def get_recipe(
    recipe_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    doc = await db.recipes.find_one({
        "_id": ObjectId(recipe_id),
        "user_id": current_user["uid"]
    })
    if not doc:
        raise HTTPException(status_code=404, detail="Recipe not found")

    doc["_id"] = str(doc["_id"])
    return RecipeOut.from_mongo(doc).model_dump(by_alias=True, mode="json")


@router.put("/{recipe_id}", response_model=RecipeOut)
async def update_recipe(
    recipe_id: str,
    recipe: RecipeCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
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

    updated_doc = await db.recipes.find_one({
        "_id": ObjectId(recipe_id),
        "user_id": current_user["uid"]
    })
    if not updated_doc:
        raise HTTPException(status_code=404, detail="Recipe not found")

    updated_doc["_id"] = str(updated_doc["_id"])
    return RecipeOut.from_mongo(updated_doc).model_dump(by_alias=True, mode="json")


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
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
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        ingredient_strings = [
            f"{i.quantity} {i.unit} {i.name}" for i in req.ingredients
        ]
        print("ingredient_strings:", ingredient_strings)

        recipe_data = await generate_recipe_from_ingredients(ingredient_strings)
        print("GPT returned recipe_data:", json.dumps(recipe_data, indent=2))

        try:
            validated = RecipeCreate(**recipe_data)
            recipe_doc = validated.model_dump(mode="json")
        except ValidationError as ve:
            print("Validation failed:", ve.errors())
            raise HTTPException(
                status_code=422,
                detail=f"{ERR_VALIDATION_FAILED}: {ve.errors()}"
            )

        recipe_doc["user_id"] = current_user["uid"]
        recipe_doc["created_at"] = datetime.now(timezone.utc)
        recipe_doc["updated_at"] = datetime.now(timezone.utc)

        result = await db.recipes.insert_one(recipe_doc)
        saved_recipe = await db.recipes.find_one({"_id": result.inserted_id})
        saved_recipe["_id"] = str(saved_recipe["_id"])

        return RecipeOut.from_mongo(saved_recipe).model_dump(by_alias=True, mode="json")

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail=ERR_INVALID_JSON)
    except Exception as e:
        raise HTTPException(status_code=500, detail=ERR_INTERNAL_ERROR.format(str(e)))
    