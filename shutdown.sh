#!/bin/bash

echo "Stopping all services..."
pkill -f 'unicorn main:app'
pkill -f 'vite'
docker compose down
echo "All services stopped."