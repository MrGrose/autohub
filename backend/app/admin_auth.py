import secrets

from fastapi import Request
from sqladmin.authentication import AuthenticationBackend
from starlette.responses import RedirectResponse

from app.admin_csrf import CSRF_SESSION_KEY, ensure_csrf_token
from app.auth_credentials import verify_admin_credentials

SESSION_KEY = "admin_authenticated"


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = (form.get("username") or "").strip()
        password = form.get("password") or ""
        if verify_admin_credentials(username, password):
            request.session[SESSION_KEY] = True
            request.session[CSRF_SESSION_KEY] = secrets.token_urlsafe(32)
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        if not request.session.get(SESSION_KEY):
            return False
        ensure_csrf_token(request)
        return True


def admin_login_redirect() -> RedirectResponse:
    return RedirectResponse(url="/admin/login", status_code=303)


async def require_admin(request: Request) -> RedirectResponse | None:
    if not request.session.get(SESSION_KEY):
        return admin_login_redirect()
    ensure_csrf_token(request)
    return None
