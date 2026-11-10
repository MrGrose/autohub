from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.import_price_service import build_import_price_payload
from app.schemas import ImportPriceResponse

router = APIRouter(prefix="/api/v1", tags=["import-price"])


@router.get("/import-price", response_model=ImportPriceResponse)
def list_import_price(db: Session = Depends(get_db)) -> dict:
    return build_import_price_payload(db)
