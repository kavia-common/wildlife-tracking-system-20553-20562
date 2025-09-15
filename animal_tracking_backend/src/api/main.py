from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from src.core.config import settings
from src.routes import animals, auth

# FastAPI application metadata aligned with documentation best practices
app = FastAPI(
    title="Animal Tracking Backend API",
    description=(
        "Backend services for the Animal Tracking System.\n\n"
        "Provides RESTful endpoints for managing animals and authentication.\n"
        "Style: Ocean Professional (Modern) - clean, concise documentation and consistent structure."
    ),
    version="1.0.0",
    contact={
        "name": "Wildlife Tracking Team",
        "email": "support@example.com",
    },
    license_info={
        "name": "MIT",
    },
    openapi_tags=[
        {"name": "Health", "description": "Service health and meta endpoints."},
        {"name": "Auth", "description": "Authentication endpoints for obtaining and verifying tokens."},
        {"name": "Animals", "description": "CRUD operations for animal entities."},
        {"name": "WebSocket", "description": "Real-time interfaces (reserved for future use)."},
    ],
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"], summary="Health Check", description="Simple health check endpoint.")
def health_check():
    """
    PUBLIC_INTERFACE
    Health check endpoint.

    Returns:
        dict: A JSON message indicating the service is healthy.
    """
    return {"message": "Healthy"}


# Register routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(animals.router, prefix="/animals", tags=["Animals"])


def custom_openapi():
    """
    PUBLIC_INTERFACE
    Generate a custom OpenAPI schema with project-level notes, including WebSocket usage placeholder.
    """
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description
        + "\n\nNote: WebSocket endpoints are reserved for future real-time tracking (e.g., live location updates).",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
