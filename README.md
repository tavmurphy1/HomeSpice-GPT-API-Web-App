# HomeSpice: Smart Recipe Generator
# GPT API Challenge

## Prerequisites

Before you begin, make sure you have:

- Python 3.8+ and `pip`
- Node.js (v16 or newer) and `npm`
- A MongoDB Atlas cluster (or Mongo URI)
- An OpenAI API key
- A Firebase project with Email/Password Authentication enabled

## Environment Variables

This project uses two `.env` files:

### `client/.env`
Used by Vite to inject environment variables into the frontend at build time. Must contain only variables prefixed with `VITE_`.

Reference: `client/.env.example`

### `server/.env`
Used by the FastAPI backend, loaded via `python-dotenv` and `load_dotenv()` in `gptClient.py`.

Reference: `server/.env.example`

## Run the app using the startup script:
./startup.sh

This will:
- Install frontend dependencies with npm install
- Install backend dependencies using requirements.txt
- Start both the Vite frontend and FastAPI backend servers

Access the app at:
- Frontend: http://localhost:5173
- Backend/API Docs: http://localhost:8080/docs

## Stop the app using the shutdown scrip:
./shutdown.sh