from fastapi import FastAPI

from backend.app.core.config import settings
from backend.app.database.base import Base
from backend.app.database.engine import engine
from backend.app.api.users import router as users_router
# Import models so SQLAlchemy knows about them
from backend.app.models.user import User
from backend.app.models.conversation import Conversation
from backend.app.models.message import Message
from backend.app.api.conversations import router as conversations_router
from backend.app.api.messages import router as messages_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)
app.include_router(users_router)
app.include_router(conversations_router)
app.include_router(messages_router)

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