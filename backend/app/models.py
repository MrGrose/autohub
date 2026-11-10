import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Car(Base):
    """Одна таблица: машина + пути к фото в JSON."""

    __tablename__ = "cars"
    __table_args__ = (Index("ix_cars_active_created", "is_active", "created_at"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(500), nullable=False)
    country: Mapped[str | None] = mapped_column(String(32), nullable=True)
    price_rub: Mapped[int | None] = mapped_column(Integer, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    photos: Mapped[list] = mapped_column(JSONB, default=list, server_default="[]", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    @property
    def photo_files(self) -> None:
        # Заглушка для SQLAdmin: поле только в форме, не в БД.
        return None


class ImportCountry(Base):
    """Страна для прайс-листа импорта (Китай, Корея, ОАЭ, Япония)."""

    __tablename__ = "import_countries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    label: Mapped[str] = mapped_column(String(64), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    items: Mapped[list["ImportPriceItem"]] = relationship(back_populates="country")

    def __str__(self) -> str:
        return self.label


class PriceSegment(Base):
    """Ценовой сегмент прайс-листа (до 1,5 / 2 / 2,5 / 3 млн ₽)."""

    __tablename__ = "price_segments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    label: Mapped[str] = mapped_column(String(64), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    items: Mapped[list["ImportPriceItem"]] = relationship(back_populates="segment")

    def __str__(self) -> str:
        return self.label


class ImportPriceItem(Base):
    """Позиция прайс-листа импорта: модель + двигатель."""

    __tablename__ = "import_price_items"
    __table_args__ = (Index("ix_import_price_active_sort", "is_active", "sort_order"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(500), nullable=False)
    specs: Mapped[str] = mapped_column(String(500), nullable=False)
    horsepower: Mapped[str | None] = mapped_column(String(500), nullable=True)
    country_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("import_countries.id"), nullable=False
    )
    segment_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("price_segments.id"), nullable=True
    )
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    country: Mapped[ImportCountry] = relationship(back_populates="items")
    segment: Mapped[PriceSegment | None] = relationship(back_populates="items")

    def __str__(self) -> str:
        return self.name
