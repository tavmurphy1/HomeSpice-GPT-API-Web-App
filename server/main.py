import firebase_init
from firebase_admin import auth
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from db import get_db

# Routers
from routes.ingredients import router as ingredients_router
from routes.authUser import router as auth_router
from routes.userList import router as users_router
from routes.recipes import router as recipes_router

app = FastAPI(title="HomeSpice API")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://localhost:5185"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/", tags=["root"])
async def read_root():
    return {"message": "FastAPI + Motor server is running!"}


# Health endpoint
@app.get("/health", tags=["health"])
async def health(db=Depends(get_db)):
    return {"status": "ok"}

# Mount routers
app.include_router(
    ingredients_router,
    prefix="/ingredients",
    tags=["ingredients"]
)

app.include_router(
    auth_router,   # handles /user/create-account, /user/login, /user/profile
    prefix="/user",
    tags=["user"]
)

app.include_router(
    users_router,
    prefix="/users",
    tags=["users"]
)

app.include_router(
    recipes_router,
    prefix="/recipes",
    tags=["recipes"]
)


# Custon OPENAPI function created to bypass FastAPI schema generation
# FastAPI has issues with Firebase authentication backend Token verification
# This function authenticates the JWT-bearer authentication
# Custom openAPI skeleton code taken from documentation and used for our
# project
# Citation Source: https://fastapi.tiangolo.com/how-to/extending-openapi/
# #normal-fastapi
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    # Generate base schema
    schema = get_openapi(
        title=app.title,
        version="0.1.0",
        routes=app.routes,
    )
    # Define security scheme
    schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    schema["security"] = [{"bearerAuth": []}]
    app.openapi_schema = schema
    return app.openapi_schema


# Tell FastAPI to use our custom schema function called custon_openapi
app.openapi = custom_openapi
