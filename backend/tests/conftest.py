import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("DATABASE_URL", "postgresql+psycopg2://autohub:autohub@127.0.0.1:5434/autohub")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-ci-only-32-chars")
os.environ.setdefault("ADMIN_USERNAME", "admin")
os.environ.setdefault("ADMIN_PASSWORD", "test-password-123")
os.environ.setdefault("MEDIA_ROOT", "uploads-test")
Path(os.environ["MEDIA_ROOT"]).mkdir(parents=True, exist_ok=True)

from app.database import Base, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def clean_db(client):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
