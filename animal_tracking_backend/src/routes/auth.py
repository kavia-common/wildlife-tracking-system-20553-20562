from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated

from src.schemas.auth import Token, LoginRequest
from src.services.security import create_access_token, verify_token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def _validate_user(username: str, password: str) -> bool:
    # Placeholder user validation. Replace with DB or external auth later.
    # Using a minimal demo: username=admin, password=admin
    return username == "admin" and password == "admin"


# PUBLIC_INTERFACE
@router.post(
    "/login",
    response_model=Token,
    summary="Obtain access token",
    description="Authenticate with username and password to receive a JWT bearer token.",
)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """
    Authenticate a user and return a bearer token.

    Request form fields:
        - username: str
        - password: str

    Returns:
        Token: Access token and type.

    Raises:
        HTTPException: 401 if credentials are invalid.
    """
    if not _validate_user(form_data.username, form_data.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(sub=form_data.username)
    return Token(access_token=token)


# PUBLIC_INTERFACE
@router.post(
    "/verify",
    summary="Verify access token",
    description="Verify JWT token validity and return its payload.",
)
def verify(token: LoginRequest):
    """
    Verify a token sent in the request body.

    Args:
        token (LoginRequest): Uses 'username' to carry the token in this demonstration is not ideal,
                              but kept to avoid adding extra schema. Prefer using Authorization header
                              in production.

    Returns:
        dict: Decoded payload if token is valid.
    """
    try:
        payload = verify_token(token.password)
        return {"valid": True, "payload": payload}
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc


# PUBLIC_INTERFACE
def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> str:
    """
    Dependency: validate current user from bearer token.
    Returns the 'sub' (username) from the token if valid.
    """
    try:
        payload = verify_token(token)
        return payload.get("sub", "unknown")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
