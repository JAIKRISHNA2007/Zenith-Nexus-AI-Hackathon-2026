# AI Integration Module

## Overview

This module implements the AI layer of the Intelligent Database Interaction & Visualization Platform.

It uses a **ReAct Agent (LangGraph)** to convert natural language into SQL, analyze results, generate visualization metadata, and produce business insights.

---

## Responsibilities

- Natural Language Understanding
- ReAct Agent Workflow
- Conversation Memory
- Multi-LLM Provider Architecture
- SQL Generation
- SQL Execution Interface
- Business Insight Generation
- Chart Metadata Generation
- Flowchart Metadata Generation
- Structured JSON Responses

---

## Architecture

```
User
  │
  ▼
ReAct Agent
  │
  ├── Generate SQL
  ├── Execute Query
  ├── Generate Chart
  ├── Generate Flowchart
  └── Explain Results
          │
          ▼
 Structured JSON Response
```

---

## Folder Structure

```
agents/
providers/
memory/
prompts/
tools/
schemas/
response/
utils/
```

---

## AI Tools

| Tool | Purpose |
|------|---------|
| get_schema | Retrieve database schema |
| generate_sql | Convert NL → SQL |
| execute_query | Execute SQL |
| generate_chart | Generate chart metadata |
| generate_flowchart | Generate Mermaid diagrams |
| explain_data | Generate business insights |

---

## LLM Providers

Current Provider:

- ✅ Gemini (Production)

Architecture Ready:

- ⚠️ Groq (Experimental)
- Future providers can be added through the Provider Factory.

---

## Output

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
- ✅ Multi-Provider Architecture
- ✅ SQL Generation
- ✅ Structured Responses
- ✅ Error Handling
- ⏳ Backend Integration
- ⏳ Frontend Integration
- ⏳ Visualization Integration