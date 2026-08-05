from sqlalchemy import text

from backend.app.database.engine import engine


def execute_query(sql: str):
    with engine.connect() as connection:
        result = connection.execute(text(sql))

        rows = [
            dict(row._mapping)
            for row in result
        ]

    return {
        "rows": rows
    }