import re
from sqlalchemy import text
from backend.app.services.sql_validator import validate_sql_query, SQLValidationException
from backend.app.services.bi_manager import bi_manager

MAX_DEFAULT_ROWS = 200


def execute_query(sql: str, timeout: int = 30):
    """
    Executes read-only SQL queries against the active BI Database.
    Applies safety validation and row caps.
    """
    if not sql or not isinstance(sql, str):
        return {"error": "Invalid SQL query provided"}

    # Strip markdown block wrappers if present (e.g. ```sql ... ```)
    clean_sql = re.sub(r"^```sql\s*", "", sql.strip(), flags=re.IGNORECASE)
    clean_sql = re.sub(r"^```\s*", "", clean_sql).strip()
    clean_sql = re.sub(r"\s*```$", "", clean_sql).strip()
    if clean_sql.endswith(";"):
        clean_sql = clean_sql[:-1].strip()

    try:
        validate_sql_query(clean_sql)
    except SQLValidationException as e:
        return {"error": f"SQL Safety Validation Failed: {str(e)}"}
    except Exception as e:
        return {"error": f"Validation Error: {str(e)}"}

    # Append LIMIT if not present and query is SELECT
    upper_sql = clean_sql.upper()
    if "LIMIT" not in upper_sql and upper_sql.startswith("SELECT"):
        query_to_run = f"{clean_sql} LIMIT {MAX_DEFAULT_ROWS}"
    else:
        query_to_run = clean_sql

    engine = bi_manager.get_engine()

    try:
        with engine.connect() as connection:
            result = connection.execute(text(query_to_run))
            rows = [dict(row._mapping) for row in result]
            columns = list(result.keys()) if hasattr(result, "keys") else []
            return {
                "status": "success",
                "sql": query_to_run,
                "columns": columns,
                "rows": rows,
                "row_count": len(rows),
            }
    except Exception as e:
        clean_err = str(e).split("\n")[0]
        return {
            "status": "error",
            "error": f"Database execution error: {clean_err}",
            "sql": query_to_run,
        }