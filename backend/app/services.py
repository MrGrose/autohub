from app.config import settings
from app.models import Car


def photo_urls(car: Car) -> list[str]:
    base = settings.public_media_url.rstrip("/")
    paths = car.photos if isinstance(car.photos, list) else []
    return [f"{base}/{p.lstrip('/')}" for p in paths if isinstance(p, str) and p.strip()]


def car_to_public(car: Car) -> dict:
    images = photo_urls(car)
    return {
        "id": str(car.id),
        "name": car.name,
        "country": car.country,
        "description": car.description,
        "priceRub": car.price_rub,
        "featured": car.featured,
        "image": images[0] if images else None,
        "images": images,
    }
