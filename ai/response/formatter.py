import json
import ast
import re
import logging

from ai.schemas import (
    AgentResponse,
    QuerySchema,
    ChartSchema,
    FlowchartSchema,
)

logger = logging.getLogger(__name__)


def _parse_tool_content(content):
    """
    Safely parse ToolMessage content which may be:
    - a dict  (already parsed internally by LangGraph)
    - a JSON string representing a dict
    - a Python repr string  e.g. "{'key': 'val'}"  (single-quoted, from str(dict))
    - a list  (Anthropic/Gemini content-block style) → extract text and re-parse
    - a JSON array string like '[{"type":"text","text":"..."}]'
    - a plain string
    Returns a dict or None.
    """

    # Already a dict — return immediately
    if isinstance(content, dict):
        return content

    # List of content blocks (Anthropic / Gemini style)
    if isinstance(content, list):
        text_parts = [
            item.get("text", "")
            for item in content
            if isinstance(item, dict) and "text" in item
        ]
        text = "".join(text_parts).strip()
        if text:
            result = _try_parse_string(text)
            if result is not None:
                return result
        return None

    # String content — try multiple parse strategies
    if isinstance(content, str):
        return _try_parse_string(content.strip())

    return None


def _try_parse_string(text: str):
    """
    Try to parse a string as a dict using multiple strategies:
    1. JSON parse (handles standard {"key": "value"})
    2. ast.literal_eval (handles Python repr {'key': 'value'})
    3. JSON array unwrapping (handles [{"type":"text","text":"{...}"}])
    Returns a dict or None.
    """
    if not text:
        return None

    # Strategy 1: standard JSON dict
    if text.startswith("{"):
        try:
            parsed = json.loads(text)
            if isinstance(parsed, dict):
                return parsed
        except (json.JSONDecodeError, ValueError):
            pass

        # Strategy 2: Python repr dict (single quotes from str(dict))
        try:
            parsed = ast.literal_eval(text)
            if isinstance(parsed, dict):
                return parsed
        except (ValueError, SyntaxError):
            pass

    # Strategy 3: JSON array of content blocks e.g. '[{"type":"text","text":"{...}"}]'
    if text.startswith("["):
        try:
            items = json.loads(text)
            if isinstance(items, list):
                text_parts = [
                    item.get("text", "")
                    for item in items
                    if isinstance(item, dict) and "text" in item
                ]
                inner_text = "".join(text_parts).strip()
                if inner_text:
                    return _try_parse_string(inner_text)
        except (json.JSONDecodeError, ValueError):
            pass

    return None


def format_response(messages):

    response = AgentResponse()

    # Only process messages from the current turn (after the last HumanMessage)
    current_turn_messages = []
    for msg in reversed(messages):
        current_turn_messages.insert(0, msg)
        msg_type = getattr(msg, "type", None)
        if msg_type == "human" or msg.__class__.__name__ == "HumanMessage":
            break

    # Track the last non-empty AI text content
    last_ai_text = None

    for message in current_turn_messages:
        msg_class = message.__class__.__name__
        msg_type = getattr(message, "type", None)

        # ── ToolMessage handling ──────────────────────────────────────────────
        if msg_class == "ToolMessage" or msg_type == "tool":
            tool_name = getattr(message, "name", None)
            raw_content = getattr(message, "content", None)

            if tool_name == "generate_sql":
                # SQL is always returned as a plain string
                sql_text = raw_content if isinstance(raw_content, str) else str(raw_content or "")
                # Strip any lingering markdown fences (lstrip/rstrip strip chars, not strings — use re)
                sql_text = sql_text.strip()
                sql_text = re.sub(r"^```sql\s*", "", sql_text, flags=re.IGNORECASE)
                sql_text = re.sub(r"^```\s*", "", sql_text)
                sql_text = re.sub(r"\s*```$", "", sql_text)
                sql_text = sql_text.strip()
                if sql_text and not sql_text.lower().startswith("error"):
                    response.query = QuerySchema(sql=sql_text, result=None)

            elif tool_name == "execute_query":
                data = _parse_tool_content(raw_content)
                if data is None:
                    # Fallback: store raw content as sql string
                    data = {"rows": [], "sql": str(raw_content or "")}

                rows = data.get("rows", []) if isinstance(data, dict) else []
                sql_from_result = data.get("sql", "") if isinstance(data, dict) else ""

                if not response.query:
                    response.query = QuerySchema(sql=sql_from_result, result=data)
                else:
                    response.query.result = data
                    # Prefer the executed SQL (with LIMIT applied) over the generated one
                    if sql_from_result:
                        response.query.sql = sql_from_result

            elif tool_name == "generate_chart":
                data = _parse_tool_content(raw_content)
                if data is None:
                    logger.warning("generate_chart: failed to parse tool content")
                elif data.get("status") == "error":
                    logger.warning(f"generate_chart returned error: {data.get('error')}")
                else:
                    # Normalise nested string items in the data list
                    if "data" in data and isinstance(data["data"], list):
                        normalised = []
                        for item in data["data"]:
                            if isinstance(item, str):
                                try:
                                    parsed_item = json.loads(item)
                                    normalised.append(parsed_item if isinstance(parsed_item, dict) else item)
                                except (json.JSONDecodeError, ValueError):
                                    normalised.append(item)
                            else:
                                normalised.append(item)
                        data["data"] = normalised

                    try:
                        response.chart = ChartSchema(**{k: v for k, v in data.items() if k in ChartSchema.model_fields})
                    except Exception as e:
                        logger.error(f"Error building ChartSchema: {e} | data={data}")

            elif tool_name == "generate_flowchart":
                data = _parse_tool_content(raw_content)
                if data is None:
                    logger.warning("generate_flowchart: failed to parse tool content")
                elif data.get("status") == "error":
                    logger.warning(f"generate_flowchart returned error: {data.get('error')}")
                else:
                    try:
                        response.flowchart = FlowchartSchema(**{k: v for k, v in data.items() if k in FlowchartSchema.model_fields})
                    except Exception as e:
                        logger.error(f"Error building FlowchartSchema: {e} | data={data}")

            elif tool_name == "explain_data":
                # explain_data always returns a plain string
                if isinstance(raw_content, str) and raw_content.strip():
                    response.explanation = raw_content.strip()
                elif isinstance(raw_content, list):
                    text_parts = [
                        item.get("text", "")
                        for item in raw_content
                        if isinstance(item, dict) and "text" in item
                    ]
                    joined = "".join(text_parts).strip()
                    if joined:
                        response.explanation = joined

        # ── AIMessage handling ────────────────────────────────────────────────
        elif msg_class == "AIMessage" or msg_type == "ai":
            content = getattr(message, "content", "")
            if isinstance(content, list):
                # Handle list-of-dicts format (e.g., Anthropic/Gemini style)
                text_parts = [
                    item.get("text", "")
                    for item in content
                    if isinstance(item, dict) and "text" in item
                ]
                content = "".join(text_parts)

            # Only keep last non-empty text (skip messages that only contain
            # tool_calls with empty string content)
            if isinstance(content, str) and content.strip():
                last_ai_text = content.strip()

    # Assign the last non-empty AI text as the response
    if last_ai_text:
        response.response = last_ai_text

    # ── Auto-construct chart from query results if chart was omitted ──────────
    if not response.chart and response.query and response.query.result:
        res_data = response.query.result
        rows = (
            res_data.get("rows", [])
            if isinstance(res_data, dict)
            else (res_data if isinstance(res_data, list) else [])
        )

        if rows and isinstance(rows, list) and len(rows) > 0 and isinstance(rows[0], dict):
            sql_upper = (response.query.sql or "").upper()
            keys = list(rows[0].keys())

            # Find a numeric column for Y axis (prefer the last numeric column)
            numeric_keys = [k for k in keys if isinstance(rows[0].get(k), (int, float))]

            # Also check string-encoded numbers
            if not numeric_keys:
                numeric_keys = [
                    k for k in keys
                    if isinstance(rows[0].get(k), str) and rows[0].get(k, "").replace(".", "", 1).replace("-", "", 1).isdigit()
                ]

            y_axis = numeric_keys[-1] if numeric_keys else keys[-1]

            # x_axis: prefer first non-numeric key, fall back to first key that isn't y_axis
            non_numeric_keys = [k for k in keys if k not in numeric_keys]
            x_axis = (
                next((k for k in non_numeric_keys if k != y_axis), None)
                or next((k for k in keys if k != y_axis), None)
                or keys[0]
            )

            # Infer chart type from SQL
            chart_type = "Bar"
            if any(k in sql_upper for k in ["DATE", "MONTH", "YEAR", "DAY", "TIME", "TREND"]):
                chart_type = "Line"
            elif any(k in sql_upper for k in ["SHARE", "PERCENT", "PROPORTION"]):
                chart_type = "Pie"
            elif "CORRELATION" in sql_upper:
                chart_type = "Scatter"

            response.chart = ChartSchema(
                chart_type=chart_type,
                title="Data Visualization",
                x_axis=x_axis,
                y_axis=y_axis,
                data=rows,
            )

    return response