# Dockerfile for deploying the FastAPI backend to Google Cloud Run
# This file builds the backend as a container image, which can then be deployed
# and auto-scaled in GCP.

# Use official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create app directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy all code from /server file
COPY . .

# Copy Firebase key (must match filename used in firebase_init.py)
COPY homespice-ae7aa-44106519bcde.json .

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Command to run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]