[1mdiff --git a/backend/app/services/query_service.py b/backend/app/services/query_service.py[m
[1mindex 9e62aad..6b4285a 100644[m
[1m--- a/backend/app/services/query_service.py[m
[1m+++ b/backend/app/services/query_service.py[m
[36m@@ -1,17 +1,19 @@[m
 from sqlalchemy import text[m
[32m+[m[32mfrom .sql_validator import validate_sql_query[m
 [m
 from backend.app.database.engine import engine[m
 [m
 [m
[31m-def execute_query(sql: str):[m
[31m-    with engine.connect() as connection:[m
[31m-        result = connection.execute(text(sql))[m
[32m+[m[32mdef execute_query(sql: str, timeout: int = 30):[m
[32m+[m[32m    try:[m
[32m+[m[32m        validate_sql_query(sql)[m
[32m+[m[32m    except SQLValidationException as e:[m
[32m+[m[32m        return {"error": str(e)}[m
 [m
[31m-        rows = [[m
[31m-            dict(row._mapping)[m
[31m-            for row in result[m
[31m-        ][m
[31m-[m
[31m-    return {[m
[31m-        "rows": rows[m
[31m-    }[m
\ No newline at end of file[m
[32m+[m[32m    with engine.connect(connect_args={{"timeout": timeout}}) as connection:[m
[32m+[m[32m        try:[m
[32m+[m[32m            result = connection.execute(text(sql))[m
[32m+[m[32m            rows = [dict(row._mapping) for row in result][m
[32m+[m[32m            return {"rows": rows}[m
[32m+[m[32m        except Exception as e:[m
[32m+[m[32m            return {"error": f"Database error: {str(e)}"}[m
\ No newline at end of file[m
