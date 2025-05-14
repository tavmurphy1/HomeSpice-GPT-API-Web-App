#!/bin/bash

#front end
echo "Setting up front end..."
cd client
npm install

echo "Starting Vite development server..."
npm run dev &

# back end
echo "Setting up back end..."
cd ../server
docker compose up -d mongo
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

echo "Starting FastAPI server..."
python3 -m uvicorn main:app --reload --host 127.0.0.1 --port 8080 &
echo "frontend: http://localhost:5173"
echo "backend: http://localhost:8080"