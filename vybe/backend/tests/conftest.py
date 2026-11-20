import os, tempfile
import pytest
from sqlalchemy import create_engine
from app.main import Base, engine

os.environ.update(
    JWT_SECRET="x" * 40,
    ALLOWED_EMAIL_DOMAIN="college.test",
    DATABASE_URL="sqlite:///" + os.path.join(tempfile.mkdtemp(), "t.db")
)

@pytest.fixture(autouse=True)
def clean_db():
    # Drop and recreate all tables for a clean slate before each test
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    yield
