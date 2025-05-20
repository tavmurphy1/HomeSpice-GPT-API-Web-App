#!/bin/bash

echo "Stopping all services..."
pkill -f 'unicorn main:app'
pkill -f 'vite'
echo "All services stopped."