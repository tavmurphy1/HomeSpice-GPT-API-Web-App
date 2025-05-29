from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from bson import ObjectId

from models.ingredient import Ingredient, IngredientInDB, format_ingredient
from db import get_db
# ensures ingredients operations scoped to users
from dependencies import get_current_user

router = APIRouter(tags=["ingredients"])


@router.post("/", response_model=dict)
async def create_ingredient(
    ingredient: Ingredient,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Create new ingredient owned by authenticated user
    print(f"POST /ingredients - Creating: {ingredient}")
    new_doc = ingredient.model_dump()
    new_doc["user_id"] = current_user["uid"]
    result = await db.ingredients.insert_one(new_doc)
    created = await db.ingredients.find_one({"_id": result.inserted_id})
    print(f"Created ingredient with ID: {result.inserted_id}")
    created["id"] = str(created["_id"])
    return format_ingredient(created)


@router.get("/", response_model=List[dict])
async def get_all_ingredients(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # List ingredients owned by authenticated user
    print("GET /ingredients - Fetching all ingredients")
    docs = await db.ingredients.find(
        {"user_id": current_user["uid"]}
    ).to_list(100)
    return [format_ingredient(doc) for doc in docs]


@router.get("/{ingredient_id}", response_model=dict)
async def get_ingredient(
    ingredient_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Fetch a single ingredient by ID, ensuring ownership
    print(f"GET /ingredients/{ingredient_id}")
    try:
        ingredient = await db.ingredients.find_one({
            "_id": ObjectId(ingredient_id),
            "user_id": current_user["uid"]
        })
    except Exception:
        raise HTTPException(400, detail="Invalid ID format")
    if not ingredient:
        raise HTTPException(404, detail="Ingredient not found")
    return format_ingredient(ingredient)


@router.put("/{ingredient_id}", response_model=dict)
async def update_ingredient(
    ingredient_id: str,
    updated: Ingredient,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Edit an ingredient document if owned by current user
    print(f"PUT /ingredients/{ingredient_id} - New data: {updated}")
    try:
        result = await db.ingredients.update_one(
            {
                "_id": ObjectId(ingredient_id),
                "user_id": current_user["uid"]
            },
            {"$set": updated.model_dump()}
        )
    except Exception:
        raise HTTPException(400, detail="Invalid ID format")
    if result.modified_count == 0:
        raise HTTPException(404, detail="Ingredient not found or not changed")
    updated_doc = await db.ingredients.find_one(
         {
           "_id": ObjectId(ingredient_id),
           "user_id": current_user["uid"]
         }
    )
    return format_ingredient(updated_doc)


@router.delete("/{ingredient_id}", status_code=204)
async def delete_ingredient(
    ingredient_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Delete an ingredient if own by current user
    print(f"DELETE /ingredients/{ingredient_id}")
    try:
        result = await db.ingredients.delete_one({
            "_id": ObjectId(ingredient_id),
            "user_id": current_user["uid"]
        })
    except Exception:
        raise HTTPException(400, detail="Invalid ID format")
    if result.deleted_count == 0:
        raise HTTPException(404, detail="Ingredient not found")
    print(f"Deleted ingredient {ingredient_id}")
    return None
