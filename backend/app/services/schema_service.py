from sqlalchemy import inspect
from backend.app.services.bi_manager import bi_manager


def get_database_schema():
    engine = bi_manager.get_engine()
    inspector = inspect(engine)

    schema = {}

    for table in inspector.get_table_names():
        columns = []

        try:
            pk_constraint = inspector.get_pk_constraint(table)
            pk_cols = pk_constraint.get("constrained_columns", []) if pk_constraint else []
        except Exception:
            pk_cols = []

        try:
            fk_constraints = inspector.get_foreign_keys(table)
        except Exception:
            fk_constraints = []

        for column in inspector.get_columns(table):
            is_pk = column["name"] in pk_cols
            col_info = {
                "name": column["name"],
                "type": str(column["type"]),
                "primary_key": is_pk,
            }
            columns.append(col_info)

        schema[table] = {
            "columns": columns,
            "foreign_keys": fk_constraints,
        }

    return schema


def get_compact_schema_string() -> str:
    schema_dict = get_database_schema()
    lines = []
    for table, info in schema_dict.items():
        cols = []
        for c in info.get("columns", []):
            name = c.get("name")
            if c.get("primary_key"):
                cols.append(f"{name} [PK]")
            else:
                cols.append(name)
        fk_strs = []
        for fk in info.get("foreign_keys", []):
            constrained = ", ".join(fk.get("constrained_columns", []))
            referred = f"{fk.get('referred_table')}({', '.join(fk.get('referred_columns', []))})"
            fk_strs.append(f"FK({constrained} -> {referred})")
        col_str = ", ".join(cols)
        if fk_strs:
            col_str += f" | {', '.join(fk_strs)}"
        lines.append(f"Table {table}: {col_str}")
    return "\n".join(lines)
