import json

from ai.schemas import (
    AgentResponse,
    QuerySchema,
    ChartSchema,
    FlowchartSchema,
)


def format_response(messages):

    response = AgentResponse()

    for message in messages:

        if hasattr(message, "name") and message.name:

            if message.name == "generate_sql":

                response.query = QuerySchema(
                    sql=message.content,
                    result=None,
                )

            elif message.name == "execute_query":

                data = json.loads(message.content)

                if response.query:
                    response.query.result = data

            elif message.name == "generate_chart":

                chart = json.loads(message.content)

                # Convert JSON strings into dictionaries
                if "data" in chart:
                    chart["data"] = [
                        json.loads(item) if isinstance(item, str) else item
                        for item in chart["data"]
                    ]

                response.chart = ChartSchema(**chart)

            elif message.name == "generate_flowchart":

                flow = json.loads(message.content)

                response.flowchart = FlowchartSchema(**flow)

            elif message.name == "explain_data":

                response.explanation = message.content

        # Extract AI assistant message content
        msg_type = getattr(message, "type", None)
        if msg_type == "ai" or message.__class__.__name__ == "AIMessage":
            content = getattr(message, "content", "")
            if isinstance(content, list):
                text_parts = [
                    item.get("text", "")
                    for item in content
                    if isinstance(item, dict) and "text" in item
                ]
                content = "".join(text_parts)

            if isinstance(content, str) and content.strip():
                response.response = content

    return response