"""
FastAPI entrypoint for HomeSpice:
 - Async MongoDB via Motor
 - Simple health & root endpoints
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes import ingredients
from db import get_db

from routes.authUser import router as user_router
from routes.userList import router as users_router
from routes.recipes import router as recipes_router


app = FastAPI(title="HomeSpice API")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/", tags=["root"])
async def read_root():
    return {"message": "FastAPI + Motor server is running!"}

# Health check endpoint
@app.get("/health", tags=["health"])
async def health(db=Depends(get_db)):
    return {"status": "ok"}

# Import ingredient routes
app.include_router(
    ingredients.router,
    prefix="/ingredients",
    tags=["ingredients"]
)

# import user routes
app.include_router(
    user_router,
    prefix="/user",
    tags=["user"]
)
# needed to find users 
app.include_router(
    users_router,
    prefix="/users",
    tags=["users"]
)

# import recipes routes
app.include_router(
    recipes_router,
    prefix="/recipes",
    tags=["recipes"]
)
