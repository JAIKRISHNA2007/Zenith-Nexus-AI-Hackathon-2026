import re
from typing import List
from sqlparse import parse, tokens as T
from sqlparse.sql import Statement


class SQLValidationException(Exception):
    pass


FORBIDDEN_KEYWORDS = {
    "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE",
    "ATTACH", "DETACH", "VACUUM", "REINDEX", "TRUNCATE",
    "REPLACE", "GRANT", "REVOKE", "COMMIT", "ROLLBACK", "SAVEPOINT",
    "EXEC", "EXECUTE", "CALL", "SCRIPT"
}


def validate_sql_query(sql: str) -> None:
    """
    Validates that the SQL query is a read-only analytical query (SELECT).
    Rejects multi-statements, DDL, DML, and unsafe operations.
    """
    if not sql or not sql.strip():
        raise SQLValidationException("Empty SQL query")

    cleaned_sql = sql.strip()

    # Check for multiple statements separated by semicolon
    statements = [s for s in parse(cleaned_sql) if s.get_type() != 'UNKNOWN' or str(s).strip()]
    if len(statements) > 1:
        raise SQLValidationException("Multi-statement SQL execution is strictly forbidden.")

    # Convert to uppercase tokens to inspect keywords
    tokens_str = set(re.findall(r'\b[A-Za-z_]+\b', cleaned_sql.upper()))
    
    # Check forbidden keywords
    forbidden_found = tokens_str.intersection(FORBIDDEN_KEYWORDS)
    if forbidden_found:
        raise SQLValidationException(f"Forbidden statement keyword detected: {', '.join(forbidden_found)}")

    # Must start with SELECT or WITH (for CTEs) or EXPLAIN
    parsed = statements[0] if statements else None
    first_keyword = ""
    if parsed:
        for token in parsed.tokens:
            if token.ttype in (T.Keyword, T.DML, T.Keyword.CTE) and token.value:
                first_keyword = token.value.upper()
                break

    if first_keyword and first_keyword not in ("SELECT", "WITH", "EXPLAIN"):
        raise SQLValidationException(f"Only SELECT queries are allowed. Query starts with '{first_keyword}'.")

    # Reject PRAGMA statements
    if "PRAGMA" in tokens_str:
        raise SQLValidationException("PRAGMA statements are not allowed for query safety.")
