from app.database import SessionLocal
from app.models import Car


def _add_car(**kwargs) -> Car:
    defaults = {
        "name": "Toyota Camry",
        "country": "Япония",
        "price_rub": 2_500_000,
        "description": "Седан",
        "is_active": True,
        "featured": False,
        "photos": ["camry-1.jpg"],
    }
    defaults.update(kwargs)
    with SessionLocal() as session:
        car = Car(**defaults)
        session.add(car)
        session.commit()
        session.refresh(car)
        session.expunge(car)
        return car


def test_health(client) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_catalog_is_empty(client) -> None:
    response = client.get("/api/v1/cars")
    assert response.status_code == 200
    body = response.json()
    assert body["items"] == []
    assert body["total"] == 0
    assert body["countries"] == []


def test_catalog_returns_active_cars(client) -> None:
    _add_car()
    _add_car(name="Honda Freed", country="Япония", price_rub=1_900_000)
    _add_car(name="Скрытая машина", is_active=False)

    body = client.get("/api/v1/cars").json()
    assert body["total"] == 2
    assert {item["name"] for item in body["items"]} == {"Toyota Camry", "Honda Freed"}
    assert body["countries"] == ["Япония"]
    assert body["items"][0]["priceRub"] == 2_500_000
    assert body["items"][0]["images"] == ["http://127.0.0.1:8000/media/camry-1.jpg"]


def test_catalog_filters_and_sorts(client) -> None:
    _add_car(name="Дешевая", country="Китай", price_rub=1_000_000)
    _add_car(name="Дорогая", country="Китай", price_rub=3_000_000, featured=True)
    _add_car(name="Японская", country="Япония", price_rub=2_000_000)

    body = client.get("/api/v1/cars", params={"country": "Китай", "sort": "price-asc"}).json()
    assert [item["name"] for item in body["items"]] == ["Дешевая", "Дорогая"]

    body = client.get("/api/v1/cars", params={"featured": "true"}).json()
    assert [item["name"] for item in body["items"]] == ["Дорогая"]


def test_catalog_pagination_clamps_page(client) -> None:
    for index in range(3):
        _add_car(name=f"Car {index}", price_rub=1_000_000 + index)

    body = client.get("/api/v1/cars", params={"page": 99, "page_size": 2}).json()
    assert body["page"] == 2
    assert body["pages"] == 2
    assert len(body["items"]) == 1


def test_import_price_returns_empty_sections(client) -> None:
    body = client.get("/api/v1/import-price").json()
    assert body == {"countries": [], "segments": [], "sections": []}


def test_admin_requires_login(client) -> None:
    response = client.get("/admin", follow_redirects=False)
    assert response.status_code in {302, 303, 307}
    assert "/admin" in response.headers["location"]


def test_docs_require_basic_auth(client) -> None:
    assert client.get("/docs").status_code == 401
    assert client.get("/openapi.json").status_code == 401
