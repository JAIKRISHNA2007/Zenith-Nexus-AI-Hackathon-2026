from fastapi import FastAPI

from backend.app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "debug": settings.DEBUG
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }