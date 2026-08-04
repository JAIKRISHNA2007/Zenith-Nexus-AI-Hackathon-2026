from pydantic import BaseModel
from typing import List


class TableSchema(BaseModel):
    name: str
    columns: List[str]


class DatabaseSchema(BaseModel):
    tables: List[TableSchema]