from fastapi import APIRouter

from backend.app.services.schema_service import (
    get_database_schema,
)

router = APIRouter(
    prefix="/api/v1/schema",
    tags=["Schema"],
)


@router.get("")
def schema():
    return get_database_schema()