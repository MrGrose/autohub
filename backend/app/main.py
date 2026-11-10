import logging
from contextlib import asynccontextmanager
from pathlib import Path
from uuid import UUID

from fastapi import FastAPI, Form, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from starlette.middleware.sessions import SessionMiddleware

from app.admin_auth import require_admin
from app.admin_csrf import verify_csrf_token
from app.admin_ui import setup_admin
from app.api import cars as cars_api
from app.api import import_price as import_price_api
from app.config import settings, validate_production_settings
from app.database import Base, engine
from app.docs_auth import setup_protected_docs
from app.media import delete_car_photo, delete_car_photos

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    validate_production_settings()
    import app.models  # noqa: F401  (register tables)

    Base.metadata.create_all(bind=engine)
    Path(settings.media_root).mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(
    title="Autohub API",
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)
setup_protected_docs(app)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.secret_key,
    session_cookie="autohub_admin",
    same_site="lax",
    https_only=settings.is_production,
)
app.include_router(cars_api.router)
app.include_router(import_price_api.router)
app.mount("/media", StaticFiles(directory=settings.media_root), name="media")
_static = Path(__file__).resolve().parent.parent / "static"
if _static.is_dir():
    app.mount("/static", StaticFiles(directory=_static), name="static")


# До setup_admin: иначе SQLAdmin перехватывает /admin/* и delete-photos даёт 404.
@app.post("/admin/car/{car_id}/delete-photo")
async def admin_delete_photo(
    request: Request,
    car_id: UUID,
    path: str = Form(...),
    csrf_token: str = Form(...),
) -> RedirectResponse:
    if redirect := await require_admin(request):
        return redirect
    verify_csrf_token(request, csrf_token)
    delete_car_photo(car_id, path)
    return RedirectResponse(url=f"/admin/car/edit/{car_id}", status_code=303)


@app.post("/admin/car/{car_id}/delete-photos")
async def admin_delete_photos(car_id: UUID, request: Request) -> RedirectResponse:
    if redirect := await require_admin(request):
        return redirect
    form = await request.form()
    verify_csrf_token(request, form.get("csrf_token"))
    paths = [p for p in form.getlist("paths") if p]
    delete_car_photos(car_id, paths)
    return RedirectResponse(url=f"/admin/car/edit/{car_id}", status_code=303)


setup_admin(app, engine)


def _db_ok() -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        logger.exception("database health check failed")
        return False


@app.get("/health")
def health() -> JSONResponse:
    db_ok = _db_ok()
    media_ok = Path(settings.media_root).is_dir()
    ok = db_ok and media_ok
    return JSONResponse(
        status_code=200 if ok else 503,
        content={
            "status": "ok" if ok else "degraded",
            "database": "ok" if db_ok else "error",
            "media": "ok" if media_ok else "error",
        },
    )
