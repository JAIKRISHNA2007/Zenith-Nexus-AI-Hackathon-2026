from ai.agents.agent import AIAgent


def main():

    agent = AIAgent()

    response = agent.chat(
        "What tools do you have?"
    )

    print(response)


if __name__ == "__main__":
    main()