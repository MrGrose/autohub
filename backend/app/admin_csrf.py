import secrets

from fastapi import HTTPException, Request

CSRF_SESSION_KEY = "admin_csrf_token"


def ensure_csrf_token(request: Request) -> str:
    token = request.session.get(CSRF_SESSION_KEY)
    if not token:
        token = secrets.token_urlsafe(32)
        request.session[CSRF_SESSION_KEY] = token
    return token


def verify_csrf_token(request: Request, submitted: str | None) -> None:
    expected = request.session.get(CSRF_SESSION_KEY)
    if not expected or not submitted:
        raise HTTPException(status_code=403, detail="CSRF token missing")
    if not secrets.compare_digest(str(submitted), str(expected)):
        raise HTTPException(status_code=403, detail="CSRF token invalid")
