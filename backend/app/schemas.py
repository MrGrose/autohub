from pydantic import BaseModel, Field


class CarPublic(BaseModel):
    id: str
    name: str
    country: str | None = None
    description: str | None = None
    priceRub: int | None = None
    featured: bool = False
    image: str | None = None
    images: list[str] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class CarListResponse(BaseModel):
    items: list[CarPublic]
    total: int
    page: int
    page_size: int
    pages: int
    offset: int = 0
    countries: list[str] = Field(default_factory=list)


class ImportPriceCountry(BaseModel):
    id: str
    code: str
    label: str


class ImportPriceSegment(BaseModel):
    id: str
    label: str


class ImportPriceItemPublic(BaseModel):
    id: str
    name: str
    specs: str
    horsepower: str | None = None


class ImportPriceSection(BaseModel):
    id: str
    country: ImportPriceCountry
    segment: ImportPriceSegment | None = None
    items: list[ImportPriceItemPublic] = Field(default_factory=list)


class ImportPriceResponse(BaseModel):
    countries: list[ImportPriceCountry] = Field(default_factory=list)
    segments: list[ImportPriceSegment] = Field(default_factory=list)
    sections: list[ImportPriceSection] = Field(default_factory=list)
