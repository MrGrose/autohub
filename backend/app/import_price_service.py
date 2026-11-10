from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models import ImportCountry, ImportPriceItem, PriceSegment


def build_import_price_payload(db: Session) -> dict:
    countries = db.scalars(
        select(ImportCountry)
        .where(ImportCountry.is_active.is_(True))
        .order_by(ImportCountry.sort_order, ImportCountry.label)
    ).all()

    segments = db.scalars(
        select(PriceSegment)
        .where(PriceSegment.is_active.is_(True))
        .order_by(PriceSegment.sort_order, PriceSegment.label)
    ).all()

    items = db.scalars(
        select(ImportPriceItem)
        .options(joinedload(ImportPriceItem.country), joinedload(ImportPriceItem.segment))
        .where(ImportPriceItem.is_active.is_(True))
        .order_by(
            ImportPriceItem.country_id,
            ImportPriceItem.segment_id.nulls_last(),
            ImportPriceItem.sort_order,
            ImportPriceItem.name,
        )
    ).all()

    country_map = {c.id: c for c in countries}
    segment_map = {s.id: s for s in segments}

    sections: dict[tuple, dict] = {}
    for item in items:
        country = country_map.get(item.country_id)
        if not country:
            continue
        segment = segment_map.get(item.segment_id) if item.segment_id else None
        key = (country.id, segment.id if segment else None)
        if key not in sections:
            sections[key] = {
                "id": f"{country.id}-{segment.id if segment else 'none'}",
                "country": {
                    "id": str(country.id),
                    "code": country.code,
                    "label": country.label,
                },
                "segment": (
                    {"id": str(segment.id), "label": segment.label} if segment else None
                ),
                "items": [],
                "_sort": (country.sort_order, segment.sort_order if segment else 9999),
            }
        sections[key]["items"].append(
            {
                "id": str(item.id),
                "name": item.name,
                "specs": item.specs,
                "horsepower": item.horsepower,
            }
        )

    ordered_sections = sorted(sections.values(), key=lambda s: s["_sort"])
    for section in ordered_sections:
        section.pop("_sort", None)

    return {
        "countries": [
            {"id": str(c.id), "code": c.code, "label": c.label} for c in countries
        ],
        "segments": [{"id": str(s.id), "label": s.label} for s in segments],
        "sections": ordered_sections,
    }
