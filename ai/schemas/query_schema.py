from pydantic import BaseModel
from typing import Any


class QuerySchema(BaseModel):
    sql: str
    result: Any