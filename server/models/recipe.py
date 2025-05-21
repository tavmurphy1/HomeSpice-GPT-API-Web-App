from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone

# Base model for Recipe per our ERD
class RecipeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    ingredients: List[str] = Field(
        ..., description="List of ingredient names or IDs"
    )
    steps: List[str] = Field(
        ..., description="Ordered list of preparation steps"
    )
    prep_time: Optional[int] = Field(
        None, ge=0, description="Preparation time in minutes"
    )
    cook_time: Optional[int] = Field(
        None, ge=0, description="Cooking time in minutes"
    )
    servings: Optional[int] = Field(
        None, ge=1, description="Number of servings"
    )
    image_url: Optional[HttpUrl] = None     # TODO: placeholder for
                                            # DALL-E stretch goal

# Placeholder model for incoming create requests
# e.g., when user clicks "generate recipe"
class RecipeCreate(RecipeBase):
    """Payload for creating a new recipe"""
    pass


# Internal DB Model
class RecipeInDB(RecipeBase):
    id: Optional[str] = Field(alias="_id")
    user_id: str = Field(..., description="Owner (Firebase) UID")   # ties to authenticated userIDs
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


def format_recipe(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "description": doc.get("description"),
        "ingredients": doc["ingredients"],
        "steps": doc["steps"],
        "prep_time": doc.get("prep_time"),
        "cook_time": doc.get("cook_time"),
        "servings": doc.get("servings"),
        "image_url": doc.get("image_url"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }

# ensures that recipes returned by GPT API will be
# formatted in JSON and per desired schema
class RecipeOut(RecipeInDB):
    """Model returned in API responses"""
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )
