import shutil
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm.attributes import flag_modified

from app.config import settings
from app.database import SessionLocal
from app.models import Car

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
EXT_BY_TYPE = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
MAX_BYTES = 10 * 1024 * 1024


def media_dir() -> Path:
    p = Path(settings.media_root)
    p.mkdir(parents=True, exist_ok=True)
    return p


def detect_image_type(data: bytes) -> str | None:
    if len(data) < 12:
        return None
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


def _ext(content_type: str | None, filename: str | None, data: bytes) -> str:
    detected = detect_image_type(data)
    if detected is None:
        raise HTTPException(400, "Only JPEG, PNG, WebP")
    if content_type and content_type in ALLOWED_TYPES and content_type != detected:
        raise HTTPException(400, "Тип файла не совпадает с содержимым")
    return EXT_BY_TYPE[detected]


def save_car_photo(
    car_id: uuid.UUID, data: bytes, content_type: str | None, filename: str | None
) -> str:
    if len(data) > MAX_BYTES:
        raise HTTPException(400, "Max 10 MB")
    ext = _ext(content_type, filename, data)
    rel = f"cars/{car_id}/{uuid.uuid4()}{ext}"
    dest = media_dir() / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return rel


async def save_upload_file(car_id: uuid.UUID, upload: UploadFile) -> str:
    if upload.content_type and upload.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only JPEG, PNG, WebP")
    data = await upload.read()
    return save_car_photo(car_id, data, upload.content_type, upload.filename)


def remove_relative_paths(rel_paths: list[str]) -> None:
    for rel in rel_paths:
        full = media_dir() / rel.strip().lstrip("/")
        if full.is_file():
            full.unlink()


def delete_car_media_dir(car_id: uuid.UUID) -> None:
    car_dir = media_dir() / f"cars/{car_id}"
    if car_dir.is_dir():
        shutil.rmtree(car_dir, ignore_errors=True)


def delete_car_photos(car_id: uuid.UUID, rel_paths: list[str]) -> None:
    if not rel_paths:
        return
    prefix = f"cars/{car_id}/"
    to_remove: set[str] = set()
    for rel_path in rel_paths:
        rel = rel_path.strip().lstrip("/")
        if ".." in rel or not rel.startswith(prefix):
            raise HTTPException(400, "Недопустимый путь к файлу")
        to_remove.add(rel)
        full = media_dir() / rel
        if full.is_file():
            full.unlink()

    with SessionLocal() as session:
        car = session.get(Car, car_id)
        if not car:
            raise HTTPException(404, "Авто не найдено")
        photos = [p for p in (car.photos or []) if isinstance(p, str) and p not in to_remove]
        car.photos = photos
        flag_modified(car, "photos")
        session.commit()


def delete_car_photo(car_id: uuid.UUID, rel_path: str) -> None:
    rel = rel_path.strip().lstrip("/")
    prefix = f"cars/{car_id}/"
    if ".." in rel or not rel.startswith(prefix):
        raise HTTPException(400, "Недопустимый путь к файлу")

    full = media_dir() / rel
    if full.is_file():
        full.unlink()

    with SessionLocal() as session:
        car = session.get(Car, car_id)
        if not car:
            raise HTTPException(404, "Авто не найдено")
        photos = [p for p in (car.photos or []) if isinstance(p, str) and p != rel]
        car.photos = photos
        flag_modified(car, "photos")
        session.commit()


async def save_form_files(car_id: uuid.UUID, files: list) -> list[str]:
    paths: list[str] = []
    for item in files:
        if item is None:
            continue
        filename = getattr(item, "filename", None)
        if not filename:
            continue
        if hasattr(item, "read"):
            data = await item.read()
            content_type = getattr(item, "content_type", None)
            paths.append(save_car_photo(car_id, data, content_type, filename))
        elif isinstance(item, (bytes, bytearray)):
            paths.append(save_car_photo(car_id, bytes(item), None, filename))
    return paths
