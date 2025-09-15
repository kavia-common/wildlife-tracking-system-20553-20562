# Animal Tracking Backend (FastAPI)

This service provides RESTful APIs for the Animal Tracking System.

Features:
- Auth: OAuth2 password flow, JWT (HS256) bearer tokens
- Animals: CRUD with filtering and pagination
- OpenAPI docs: /docs and /openapi.json
- DB: SQLAlchemy with SQLite by default

Quick start:
1. Create a virtual environment and install requirements:
   pip install -r requirements.txt

2. Environment variables (see .env.example). Minimal defaults work without a .env file.

3. Run:
   uvicorn src.api.main:app --reload --host 0.0.0.0 --port 3001

Auth:
- Demo credentials: username=admin, password=admin
- Get token:
  curl -X POST -d 'username=admin&password=admin' -H 'Content-Type: application/x-www-form-urlencoded' http://localhost:3001/auth/login

Use token:
- Add header:
  Authorization: Bearer <token>

Animals:
- List: GET /animals
- Create: POST /animals
- Get: GET /animals/{id}
- Update: PUT /animals/{id}
- Delete: DELETE /animals/{id}

OpenAPI:
- /docs (Swagger UI)
- /openapi.json

Notes:
- Replace demo auth with a real user store for production.
