
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# model used to create users in our database and send them

# what our route accepts (users)
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    id: Optional[str] = Field(alias="_id")
    email: EmailStr
    hashed_password: str
