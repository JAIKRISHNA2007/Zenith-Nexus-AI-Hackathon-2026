from sqlalchemy import inspect

from backend.app.database.engine import engine


def get_database_schema():
    inspector = inspect(engine)

    schema = {}

    for table in inspector.get_table_names():
        columns = []

        for column in inspector.get_columns(table):
            columns.append({
                "name": column["name"],
                "type": str(column["type"]),
            })

        schema[table] = columns

    return schema