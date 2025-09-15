from pydantic import BaseModel, Field


# PUBLIC_INTERFACE
class Token(BaseModel):
    """
    Access token response payload.
    """
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")


# PUBLIC_INTERFACE
class LoginRequest(BaseModel):
    """
    Login request payload.
    """
    username: str = Field(..., description="Username")
    password: str = Field(..., description="Password")
