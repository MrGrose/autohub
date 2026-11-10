from math import ceil

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Car
from app.schemas import CarListResponse
from app.services import car_to_public

router = APIRouter(prefix="/api/v1", tags=["cars"])

MAX_PAGE_SIZE = 50


def _active_filters(country: str | None, featured: bool | None) -> list:
    clauses = [Car.is_active.is_(True)]
    if country:
        clauses.append(Car.country == country)
    if featured is not None:
        clauses.append(Car.featured.is_(featured))
    return clauses


def _order_by(sort: str):
    if sort == "price-asc":
        return Car.price_rub.asc().nulls_last(), Car.created_at.desc()
    if sort == "price-desc":
        return Car.price_rub.desc().nulls_last(), Car.created_at.desc()
    return (Car.created_at.desc(),)


@router.get("/cars", response_model=CarListResponse)
def list_cars(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=MAX_PAGE_SIZE),
    offset: int | None = Query(None, ge=0),
    country: str | None = Query(None, max_length=32),
    featured: bool | None = Query(None),
    sort: str = Query("price-desc", pattern="^(price-asc|price-desc|newest)$"),
) -> dict:
    filters = _active_filters(country, featured)
    sort_key = "newest" if sort == "newest" else sort

    total = db.scalar(select(func.count()).select_from(Car).where(*filters)) or 0
    pages = max(1, ceil(total / page_size)) if total else 1

    if offset is not None:
        max_offset = max(0, (pages - 1) * page_size) if total else 0
        start = min(offset, max_offset)
        page = start // page_size + 1 if page_size else 1
    else:
        page = min(page, pages)
        start = (page - 1) * page_size

    rows = db.scalars(
        select(Car)
        .where(*filters)
        .order_by(*_order_by(sort_key))
        .offset(start)
        .limit(page_size)
    ).all()

    country_rows = db.scalars(
        select(Car.country)
        .where(Car.is_active.is_(True), Car.country.is_not(None))
        .distinct()
        .order_by(Car.country)
    ).all()
    countries = [c for c in country_rows if c]

    return {
        "items": [car_to_public(c) for c in rows],
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages,
        "offset": start,
        "countries": countries,
    }
