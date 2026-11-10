from fastapi import Depends, HTTPException
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from starlette.applications import Starlette

from app.auth_credentials import verify_admin_credentials

_http_basic = HTTPBasic()


def verify_docs_credentials(credentials: HTTPBasicCredentials = Depends(_http_basic)) -> str:
    if not verify_admin_credentials(credentials.username, credentials.password):
        raise HTTPException(
            status_code=401,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": 'Basic realm="Autohub API Docs"'},
        )
    return credentials.username


def setup_protected_docs(app: Starlette) -> None:
    @app.get("/docs", include_in_schema=False)
    async def swagger_ui(_: str = Depends(verify_docs_credentials)) -> HTMLResponse:
        return get_swagger_ui_html(
            openapi_url="/openapi.json",
            title=f"{app.title} — Swagger",
        )

    @app.get("/redoc", include_in_schema=False)
    async def redoc_ui(_: str = Depends(verify_docs_credentials)) -> HTMLResponse:
        return get_redoc_html(
            openapi_url="/openapi.json",
            title=f"{app.title} — ReDoc",
        )

    @app.get("/openapi.json", include_in_schema=False)
    async def openapi_schema(_: str = Depends(verify_docs_credentials)) -> JSONResponse:
        return JSONResponse(app.openapi())
