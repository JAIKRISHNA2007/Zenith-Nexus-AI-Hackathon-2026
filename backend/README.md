# Zenith Nexus AI Backend

## Overview

This backend is built using FastAPI and SQLAlchemy following a layered architecture:

API → Service → Repository → Database

It provides authentication, user management, conversation management, message handling, schema discovery, SQL query execution, chat integration, and visualization endpoints.

---

## Tech Stack

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn
- JWT Authentication

---

## Project Structure

```
backend/
│
├── app/
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   └── main.py
│
├── requirements.txt
└── README.md
```

---

## Setup

### 1. Create Virtual Environment

```bash
python -m venv .venv
```

### 2. Activate

Windows

```bash
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
```

### 3. Install Requirements

```bash
pip install -r backend/requirements.txt
```

### 4. Configure Environment

Create a `.env` file.

Example:

```
APP_NAME=Zenith Nexus AI Backend
APP_VERSION=1.0.0
DEBUG=True

DATABASE_URL=sqlite:///database/app.db

API_PREFIX=/api/v1
SECRET_KEY=your_secret_key
```

### 5. Run Backend

```bash
uvicorn backend.app.main:app --reload
```

Swagger:

```
http://127.0.0.1:8000/docs
```

---

## Implemented APIs

### Authentication

- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`

### Users

- GET `/api/v1/users`
- POST `/api/v1/users`

### Conversations

- GET `/api/v1/conversations`
- POST `/api/v1/conversations`

### Messages

- GET `/api/v1/messages/{conversation_id}`
- POST `/api/v1/messages/{conversation_id}`

### Chat

- POST `/api/v1/chat`

(Currently placeholder for AI integration.)

### Schema Discovery

- GET `/api/v1/schema`

Returns database tables and columns.

### Query Execution

- POST `/api/v1/query`

Executes SQL queries (currently intended for development/testing).

### Visualization

- POST `/api/v1/visualization`

Returns data prepared for visualization (currently placeholder).

---

## Architecture

```
Client
   │
   ▼
FastAPI Router
   │
   ▼
Service Layer
   │
   ▼
Repository Layer
   │
   ▼
Database
```

---

## Database Models

### User

- id
- name
- email
- password

### Conversation

- id
- user_id
- created_at
- updated_at

### Message

- id
- conversation_id
- role
- content
- created_at

---

## Current Status

Completed:

- FastAPI setup
- SQLAlchemy integration
- JWT Authentication
- User module
- Conversation module
- Message module
- Chat API
- Schema API
- Query API
- Visualization API
- Swagger Documentation

Pending (Integration Phase):

- AI service integration
- Frontend integration
- Visualization logic
- End-to-end testing

---

## Notes

- SQLite according to the backend
