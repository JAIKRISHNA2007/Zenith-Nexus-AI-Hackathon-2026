import os

from fastapi.middleware.cors import CORSMiddleware
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
from backend.app.api.auth import router as auth_router
from backend.app.api.chat import router as chat_router
from backend.app.api.schema import router as schema_router
from backend.app.api.query import router as query_router
from backend.app.api.visualization import router as visualization_router
from backend.app.api.dataset import router as dataset_router



# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

# Build CORS origins: keep local dev origins + add deployed frontend URL if set
_cors_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]
_frontend_url = os.getenv("FRONTEND_URL")
if _frontend_url:
    _cors_origins.append(_frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users_router)
app.include_router(conversations_router)
app.include_router(messages_router)
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(schema_router)
app.include_router(query_router)
app.include_router(visualization_router)
app.include_router(dataset_router)

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