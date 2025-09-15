from datetime import datetime, timedelta, timezone
import base64
import hmac
import hashlib
import json
from typing import Optional

from src.core.config import settings


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode((data + padding).encode("utf-8"))


# PUBLIC_INTERFACE
def create_access_token(sub: str, expires_minutes: Optional[int] = None) -> str:
    """
    Create a signed JWT token (HS256) without external dependencies.

    Args:
        sub: Subject (user identifier).
        expires_minutes: Expiration in minutes; defaults to ACCESS_TOKEN_EXPIRE_MINUTES.

    Returns:
        str: Encoded JWT.
    """
    expire_delta = timedelta(minutes=expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    now = datetime.now(tz=timezone.utc)
    payload = {
        "sub": sub,
        "iat": int(now.timestamp()),
        "exp": int((now + expire_delta).timestamp()),
    }
    header = {"alg": "HS256", "typ": "JWT"}

    header_b64 = _b64url_encode(json.dumps(header, separators=(",", ":"), sort_keys=True).encode("utf-8"))
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    token = f"{header_b64}.{payload_b64}.{_b64url_encode(signature)}"
    return token


# PUBLIC_INTERFACE
def verify_token(token: str) -> dict:
    """
    Verify a JWT token signed with HS256 and return the payload.

    Raises:
        ValueError: If token is invalid or expired.
    """
    try:
        header_b64, payload_b64, signature_b64 = token.split(".")
    except ValueError as exc:
        raise ValueError("Invalid token format") from exc

    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    expected_sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    actual_sig = _b64url_decode(signature_b64)
    if not hmac.compare_digest(expected_sig, actual_sig):
        raise ValueError("Invalid token signature")

    payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
    now_ts = int(datetime.now(tz=timezone.utc).timestamp())
    if "exp" in payload and now_ts > int(payload["exp"]):
        raise ValueError("Token expired")
    return payload
