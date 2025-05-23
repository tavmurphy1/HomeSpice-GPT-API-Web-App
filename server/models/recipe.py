from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
from models.ingredient import Ingredient


# Base model for Recipe per our ERD
class RecipeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    ingredients: List[Ingredient] = Field(
        ..., description="List of ingredients with name, quantity, and unit"
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
    image_url: Optional[HttpUrl] = None  # Optional image link


# Payload for creating a new recipe
class RecipeCreate(RecipeBase):
    pass


# Internal DB model (used for saving to MongoDB)
class RecipeInDB(RecipeBase):
    id: Optional[str] = Field(default=None)
    user_id: str = Field(..., description="Owner (Firebase) UID")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


# Public-facing API response model
class RecipeOut(RecipeInDB):
    """Model returned in API responses"""

    @classmethod
    def from_mongo(cls, doc: dict) -> "RecipeOut":
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        doc["ingredients"] = [Ingredient(**ing) for ing in doc["ingredients"]]
        return cls.model_validate(doc)

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )
