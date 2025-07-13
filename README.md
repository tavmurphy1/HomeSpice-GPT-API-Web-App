# HomeSpice: Smart Recipe Generator
------------------------------
## Live Deployment

- **Frontend (UI) (Firebase Hosting)**: https://homespice-ae7aa.web.app
- **Backend (Google Cloud Run)**: https://homespice-api-262419158229.us-central1.run.app

------------------------------

## Key Features

•	Smart Recipe Generation
  - Uses OpenAI’s GPT API to create personalized recipes based on available ingredients, reducing decision fatigue and food waste.
•	Ingredient Input via Text or Image
  - Supports flexible ingredient entry, allowing users to type in pantry items or upload photos for AI-based recognition (via future integration).
•	Real-Time Suggestions
  - Instantly generates recipe options tailored to the user’s on-hand ingredients, with dietary filters and cuisine preferences coming soon.
•	Secure User Profiles
  - Firebase Authentication secures user data, enabling users to log in, manage their pantry, and save favorite recipes across devices.
•	Favorites & Recipe History
  - Users can save, view, and revisit favorite recipes for easy meal planning and repeat use.
•	Modern UI/UX
  - Built with React and Vite for a responsive, intuitive interface with real-time updates and smooth navigation.
------------------------------
## Technologies Used

Back End:
	•	FastAPI – Chosen for its native async support, enabling high scalability and clean API design.
	•	Python – Used for backend logic, async services, and OpenAI API integration.
	•	Uvicorn – An ASGI server used to run the FastAPI app with high concurrency.
	•	Motor – An asynchronous MongoDB driver to manage user, pantry, and recipe data.
	•	OpenAI GPT-3.5 Turbo API – Powers the intelligent recipe generation.
	•	RapidJSON – Parses and validates AI-generated JSON responses for structured recipe data.
	•	JSON – Used for structured requests and responses between services.

Front End:
	•	TypeScript – Ensures strong type safety and maintainable front-end logic.
	•	React.js – Builds a dynamic, component-based UI with support for protected routes and state management.
	•	Vite – Fast and modern frontend build tool for efficient development.
	•	Firebase Authentication – Handles secure user login, session management, and per-user data access

------------------------------
## Description

- **Frontend (UI) (Firebase Hosting)**: https://homespice-ae7aa.web.app
- **Backend (Google Cloud Run)**: https://homespice-api-262419158229.us-central1.run.app

------------------------------


## Run Locally (Developer Environment)

### Prerequisites

Before you begin, make sure you have:

- Python 3.8+ and `pip`
- Node.js (v16 or newer) and `npm`
- A MongoDB Atlas cluster (or Mongo URI)
- An OpenAI API key
- A Firebase project with Email/Password Authentication enabled

### Environment Variables

This project uses two `.env` files:

#### `client/.env`
Used by Vite to inject environment variables into the frontend at build time. Must contain only variables prefixed with `VITE_`.

Reference: `client/.env.example`

#### `server/.env`
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
- Backend(API) Docs: http://localhost:8080/docs

## Stop the app using the shutdown scrip:
./shutdown.sh
