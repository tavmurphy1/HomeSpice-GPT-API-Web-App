#!/bin/bash


echo "Stopping Vite and Uvicorn processes..."
pkill -f 'vite'
pkill -f 'uvicorn main:app'

echo "Cleaning up any processes on ports 5173 and 8080..."
lsof -ti :5173 | xargs kill -9 2>/dev/null
lsof -ti :8080 | xargs kill -9 2>/dev/null

echo "All services stopped and ports cleared."