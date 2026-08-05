from fastapi import APIRouter

from backend.app.schemas.query import (
    QueryRequest,
    QueryResponse,
)
from backend.app.services.query_service import execute_query

router = APIRouter(
    prefix="/api/v1/query",
    tags=["Query"],
)


@router.post(
    "",
    response_model=QueryResponse,
)
def run_query(request: QueryRequest):
    return execute_query(request.sql)