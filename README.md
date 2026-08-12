# Zenith Nexus AI - Conversational BI & Data Visualization Agent

[![Sairam Hackathon 2026](https://img.shields.io/badge/Hackathon-iTech_AI_Innovation_2026-blue)](https://github.com)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![React Vite](https://img.shields.io/badge/Frontend-React_Vite-61DAFB)](https://vitejs.dev/)
[![LLM Provider](https://img.shields.io/badge/LLM-NVIDIA_NIM_%2F_Gemini_%2F_Groq-green)](https://nvidia.com)

**Zenith Nexus AI** is an enterprise-grade, no-code Conversational Business Intelligence (BI) platform built for the **Sairam / iTech AI Innovation Hackathon 2026**. It empowers non-technical and technical users to connect datasets, query databases using natural language, execute safe read-only SQL, and generate real-time visualizations (Charts & Flowcharts) without writing code.

---

## 🚀 Key Features

- 💬 **ChatGPT-Like Conversational BI**: Ask complex natural-language data questions with multi-turn context.
- ⚡ **Multi-Provider LLM Abstraction**: Supports **NVIDIA NIM / Nemotron** (Primary), **Google Gemini**, and **Groq** with automatic fallback.
- 📊 **Dynamic Visualizations**: Native SVG rendering for **Bar**, **Line**, **Pie**, and **Scatter** charts, formatted **Data Tables**, and **KPI Cards**.
- 🔀 **Diagram & Flowchart Generation**: Generates **Entity-Relationship (ER) Diagrams**, **Process Flows**, and **Decision Trees** using Mermaid.js syntax.
- 🛡️ **Read-Only SQL Safety Engine**: Enforces strict read-only analytical SQL execution (`SELECT`, `JOIN`, `GROUP BY`, `HAVING`, `ORDER BY`). Blocks any DDL/DML data mutations.
- 🗄️ **Database & Dataset Connection**:
  - Built-in **Sample E-Commerce BI Database** (seeded with orders, customers, products, items, inventory).
  - Drag-and-drop **CSV / Excel Dataset Upload**.
  - **Custom SQL Database URI Connection**.
- 🔍 **SQL Transparency**: View and copy generated SQL queries directly inside chat bubbles.
- 📥 **Comprehensive Exports**: Export charts & insights as **PNG**, **SVG**, **CSV**, and **PDF**.
- 🎙️ **Voice Query Input**: Speech-to-text input powered by browser speech recognition.

---

## 🛠️ Required Agent Tools

Zenith Nexus AI implements five core function-calling tools:

| Tool Name | Purpose | Output |
| :--- | :--- | :--- |
| `get_schema` | Inspects database tables, column types, primary keys, and relationships | Structured JSON Schema |
| `execute_query` | Safely executes read-only analytical SQL queries | JSON Query Results & Metadata |
| `generate_chart` | Creates specifications for Bar, Line, Pie, and Scatter charts | Structured Chart Specification |
| `generate_flowchart` | Generates Mermaid specifications for ER and Process Flow diagrams | Diagram Specification |
| `explain_data` | Generates executive business summaries and recommendations | Natural Language Insights |

---

## 🏗️ Architecture

```
Zenith-Nexus-AI/
├── frontend/             # React + Vite + TailwindCSS UI
│   ├── src/
│   │   ├── components/  # Chat, Visualization Panel, DB Modal
│   │   ├── services/    # Axios API Clients
│   │   └── store/       # Zustand State Management
├── backend/              # FastAPI Python Backend
│   ├── app/
│   │   ├── api/         # Endpoints (chat, dataset, query, schema, auth)
│   │   ├── database/    # SQLite Persistence & Seeding Engine
│   │   └── services/    # BI Manager, SQL Validator, Query Service
├── ai/                   # AI Agent Engine
│   ├── providers/       # NVIDIA NIM, Gemini, Groq Abstraction Layer
│   ├── agents/          # LangGraph ReAct Agent
│   ├── tools/           # 5 Core Agent Function Calling Tools
│   └── prompts/         # System Prompt & Formatter
└── README.md
```

---

## ⚙️ Environment Configuration (`.env`)

Create a `.env` file in the root directory:

```env
# Application Settings
APP_NAME="Zenith Nexus AI"
DEBUG=True
DATABASE_URL="sqlite:///backend/database/app.db"
SECRET_KEY="zenith_super_secret_key"

# LLM Provider Selection (nvidia_nim | gemini | groq)
LLM_PROVIDER=nvidia_nim

# NVIDIA NIM Configuration
NVIDIA_NIM_API_KEY=your_nvidia_nim_api_key
NVIDIA_NIM_MODEL=nvidia/nemotron-4-340b-instruct
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1

# Gemini Configuration (Fallback)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# Groq Configuration
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Backend Setup
```bash
# Navigate to project root
cd Zenith-Nexus-AI-Hackathon-2026

# Install Python dependencies
pip install -r backend/requirements.txt
pip install -r ai/requirements.txt

# Start FastAPI server
uvicorn backend.app.main:app --reload --port 8000
```
Backend server will run at `http://localhost:8000`.

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend application will run at `http://localhost:5173`.

---

## 📸 Deliverables & Media Placeholders

- **Live Deployment Link**: `[Insert Deployment URL Here]`
- **Demo Video Walkthrough**: `[Insert 3-5 Minute Video Link Here]`
- **Screenshots & Media**: `[Insert Screenshots Here]`

---

## 🏆 Hackathon Team
Developed for **Sairam / iTech AI Innovation Hackathon 2026**.
