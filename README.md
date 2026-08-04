# AI Integration Module

## Overview

This module implements the complete AI layer of the Intelligent Database Interaction & Visualization platform for the iTech AI Innovation Hackathon 2026.

The AI system is built using a ReAct (Reasoning + Acting) architecture with LangGraph, enabling natural language understanding, autonomous tool selection, SQL generation, data analysis, and visualization planning.

---

## Responsibilities

- Natural Language Understanding
- ReAct Agent Workflow
- Conversation Memory (LangGraph)
- Multi-LLM Provider Architecture
- Database Schema Analysis
- Natural Language → SQL Generation
- SQL Execution Interface
- Business Insight Generation
- Chart Metadata Generation
- Flowchart Metadata Generation
- Structured Response Formatting

---

## Architecture

```
                User
                  │
                  ▼
           ReAct AI Agent
                  │
      ┌───────────┼────────────┐
      ▼           ▼            ▼
 Generate SQL  Query DB   Generate Charts
      │           │            │
      └───────────┼────────────┘
                  ▼
        Business Explanation
                  │
                  ▼
       Structured JSON Response
```

---

## Folder Structure

```
agents/         ReAct Agent
providers/      LLM Providers
memory/         LangGraph Memory
prompts/        System Prompts
tools/          AI Tools
schemas/        Response Schemas
response/       Response Formatter
utils/          Utility Functions
```

---

## AI Tools

| Tool | Description |
|------|-------------|
| get_schema | Retrieve database schema |
| generate_sql | Convert NL to SQL |
| execute_query | Execute SQL |
| generate_chart | Produce chart metadata |
| generate_flowchart | Produce Mermaid metadata |
| explain_data | Generate business insights |

---

## Integration Dependencies

### Input

- Backend Database API
- FastAPI Endpoints

### Output

Structured JSON

```json
{
    "query": {},
    "chart": {},
    "flowchart": {},
    "explanation": ""
}
```

---

## Current Status

- ✅ ReAct Agent
- ✅ LangGraph Memory
- ✅ Tool Calling
- ✅ SQL Generation
- ✅ Structured Responses
- ✅ Error Handling
- ⏳ Backend Integration
- ⏳ Frontend Integration

---

## Future Enhancements

- Multi-Database Support
- Dashboard Builder
- Voice Queries
- Export Reports
- Streaming Responses