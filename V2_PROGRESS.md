# Zenith Nexus AI - Upgrade & Progress Report (V2)

## Executive Summary
This document serves as the handoff and source-of-truth for the upgraded Zenith Nexus AI Business Intelligence application developed for the **Sairam / iTech AI Innovation Hackathon 2026**.

---

## Key Technical Upgrades & Architectural Decisions

### 1. Database Architecture & BI Dataset Separation
- **Application Database (`backend/database/app.db`)**: Dedicated exclusively to user authentication, conversation sessions, and chat message history persistence.
- **BI Dataset (`backend/database/ecommerce.db`)**: A realistic, multi-table e-commerce relational dataset created and seeded automatically with:
  - `customers`: Customer profiles, emails, countries.
  - `products`: Product catalog, categories, pricing.
  - `orders`: Purchase transactions, dates, statuses, total amounts.
  - `order_items`: Line-item product mapping, quantities, unit prices.
  - `inventory`: Stock levels, reorder thresholds, update timestamps.
- **Dynamic BI Manager (`backend/app/services/bi_manager.py`)**:
  - Allows seamlessly switching between the **Sample E-commerce Database**, **Uploaded Datasets (CSV/Excel)**, and **Custom SQL Database URIs**.

### 2. Multi-Provider LLM Abstraction
- Created a modular LLM provider layer supporting:
  - **NVIDIA NIM / Nemotron** (`ai/providers/nvidia_nim.py`) as primary high-performance provider.
  - **Gemini** (`ai/providers/gemini.py`) as secondary fallback.
  - **Groq** (`ai/providers/groq_provider.py`) for ultra-low-latency processing.
- Configured dynamically via environment variables (`LLM_PROVIDER`, `NVIDIA_NIM_API_KEY`, `NVIDIA_NIM_MODEL`, `GEMINI_API_KEY`, `GROQ_API_KEY`).
- Factory pattern (`ai/providers/factory.py`) with automatic fallback preventing API key exhaustion or service outages.

### 3. Read-Only Analytical SQL Safety Engine
- Enhanced SQL Validator (`backend/app/services/sql_validator.py`):
  - Strictly allows read-only analytical statements (`SELECT`, `JOIN`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, aggregates, subqueries).
  - Blocks all mutation and administrative SQL (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE`, `ATTACH`, `DETACH`, `PRAGMA`, multi-statements).
- Caps execution results at 200 rows by default to protect memory and performance.

### 4. Custom Function/Tool Calling (5 Core Agent Tools)
1. `get_schema`: Inspects active BI database structure, column types, primary keys, and foreign key relationships.
2. `execute_query`: Safely runs validated SQL queries and returns tabular JSON results.
3. `generate_chart`: Generates structured specification for **Bar**, **Line**, **Pie**, and **Scatter** charts.
4. `generate_flowchart`: Generates structured Mermaid specs for **ER Diagrams**, **Process Flows**, and **Decision Trees**.
5. `explain_data`: Generates business-focused executive insights and recommendations.

### 5. Frontend & Visualization Enhancements
- **Multi-Chart & Diagram Panel (`frontend/src/components/visualization/ChartPanel.tsx`)**:
  - Native SVG rendering for Bar, Line, Pie, and Scatter plots.
  - Formatted tabular Data View & KPI Card summary.
  - Rendered Mermaid specifications for ER and Process Flow diagrams.
- **Functional Exports**:
  - **PNG Image** export (Canvas conversion).
  - **SVG Vector** download.
  - **CSV Data** export.
  - **PDF Report** print/export option.
- **SQL Transparency**: Toggleable SQL view with copy-to-clipboard functionality inside chat bubbles.
- **Database Connection Header & Modal (`DatabaseConnectionModal.tsx`)**:
  - Seamlessly switch between Sample E-commerce DB, CSV Uploads, and Custom SQL URIs.
- **Voice Query Input**: Integrated Web Speech API for voice-to-text input.

---

## Verification & Completed Tests
- [x] Backend FastAPI startup and health check.
- [x] Authentication & JWT user persistence.
- [x] Separation of Application DB (`app.db`) and BI Dataset (`ecommerce.db`).
- [x] SQL safety validator & query execution capping.
- [x] Dynamic LLM Provider selection (NVIDIA NIM / Gemini / Groq).
- [x] 5 Agent Tools end-to-end execution.
- [x] Visualization panel (Bar, Line, Pie, Scatter, Table, Diagram).
- [x] Export options (PNG, SVG, CSV, PDF).

---

## Future Enhancements
- Fine-tuning prompt templates for domain-specific custom uploaded CSV schemas.
- Real-time collaborative dashboard sharing across multi-tenant teams.
