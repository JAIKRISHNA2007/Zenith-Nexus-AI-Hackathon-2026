# Zenith Nexus AI - AI Module

## Overview

This module provides the AI engine for Zenith Nexus AI.

It uses **LangGraph** with **NVIDIA Nemotron** to:

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
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

## Output

The AI returns structured JSON containing:

- SQL query
- Query results
- Business explanation
- Chart metadata (optional)
- Flowchart metadata (optional)
