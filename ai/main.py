from ai.agents.react_agent import agent
from ai.response import format_response

THREAD_ID = "demo-user"


def chat(message: str):

    response = agent.invoke(
        {
            "messages": [
                ("user", message)
            ]
        },
        config={
            "configurable": {
                "thread_id": THREAD_ID
            }
        }
    )

    formatted = format_response(response["messages"])

    print("\n========== FORMATTED RESPONSE ==========\n")
    print(formatted.model_dump_json(indent=4))


def main():
    chat(
        """
    Show me the top 5 products by revenue as a bar chart.

    Explain the results.

    Show the SQL query.

    Draw the ER diagram for this database.
    """
    )


if __name__ == "__main__":
    main()