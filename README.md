# GPT-API-Challenge

## Prerequisites

- Docker Desktop** (includes `docker compose`)  
- Node.js (>=14) & npm
- Python 3.8+ & pip


## Client aka React + Vite Front-End Development Server

1. Navigate to client directory

2. "npm run dev" in console

3. Enter "http://localhost:5173/" in browser

## ## Server aka FastAPI + Motor Back-End Development Server
1. Install Dependencies
    "cd server"
    "python3 -m pip install --upgrade pip"
    "python3 -m pip install --user -r requirements.txt"

2. Start local MongoDB via Docker
    "docker compose up -d mongo"

3. Run API server
    "cd server"
    "python3 -m uvicorn main:app --reload --host 127.0.0.1 --port 8080"

## Environment Variables
In order to run the server you need to provide your own `.env`:

1. Copy `server/.env.example` to `server/.env`  
2. Fill in the `MONGODB_CONNECT_STRING` with your own MongoDB cluster URI
3. Add MONGO_DB_NAME=homespice to 'server/.env'