from pydantic import BaseModel, Field, HttpUrl
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
    user_id: Optional[str] = None  # TODO: set when user auth is in place
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        validate_by_name = True

# ensures that recipes returned by GPT API will be
# formatted in JSON and per desired schema
class RecipeOut(RecipeInDB):
    """Model returned in API responses"""
    class Config:
        from_attributes = True
