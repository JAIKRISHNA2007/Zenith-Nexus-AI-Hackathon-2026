# Zenith Nexus AI - AI Module

## Overview

This module provides the AI engine for Zenith Nexus AI.

It uses **LangGraph** with **Google Gemini** to:

- Convert natural language into SQL
- Read live database schema
- Execute SQL queries
- Generate business insights
- Recommend charts and flowcharts

## Integration

The backend communicates with the AI through:

```
ai/integration/backend_agent.py
```

Main entry point:

```python
process_prompt(prompt, conversation_id)
```

## Structure

```
agents/         AI agents
config/         Settings
graph/          LangGraph workflow
integration/    Backend integration
memory/         Conversation memory
prompts/        System prompts
providers/      Gemini/Groq providers
response/       Response formatting
schemas/        AI schemas
tools/          Schema & SQL tools
utils/          Helper functions
```

## Environment Variables

```
LLM_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-flash-latest
```

## Output

The AI returns structured JSON containing:

- SQL query
- Query results
- Business explanation
- Chart metadata (optional)
- Flowchart metadata (optional)
