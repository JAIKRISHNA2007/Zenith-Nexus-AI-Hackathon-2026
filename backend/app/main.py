from fastapi import FastAPI

from backend.app.core.config import settings
from backend.app.database.base import Base
from backend.app.database.engine import engine

# Import models so SQLAlchemy knows about them
from backend.app.models.user import User

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "debug": settings.DEBUG,
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }