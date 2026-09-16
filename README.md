# Cybercrime Pipeline — Full Stack Setup Guide

## Architecture

```
Frontend (React + Vite)          Backend (FastAPI + Python)
  http://localhost:5173    <-->    http://localhost:8000
        |
        | (Vite proxy: /api/* → localhost:8000)
        |
    Dashboard, Case Details, Bulk Share
```

## Prerequisites

### Backend
- Python 3.10+
- [Ollama](https://ollama.ai) installed and running with the Qwen model
- FFmpeg (required by Whisper)

### Frontend
- Node.js 18+
- npm

---

## Quick Start (Recommended)

Double-click **`start-all.bat`** in this folder. It will open two terminal windows — one for the backend and one for the frontend.

> **Note:** The backend must be running *before* you load the frontend in a browser.

---

## Manual Setup

### 1. Backend

```bash
cd pipeline

# (Optional but recommended) Create a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- API is available at: **http://localhost:8000**
- Swagger docs at: **http://localhost:8000/docs**

### 2. Frontend

```bash
cd Frontend

# Install packages (first time only)
npm install

# Start the dev server
npm run dev
```

- App is available at: **http://localhost:5173**

---

## How It Works

### Frontend ↔ Backend Integration

The Vite dev server proxies all `/api/*` requests to `http://localhost:8000`, so the frontend talks directly to FastAPI with no CORS issues during development.

| Frontend Route | Backend Endpoint |
|---|---|
| Dashboard loads cases | `GET /api/cases` |
| Case detail page | `GET /api/cases/{case_id}` |
| Audio playback | `GET /api/cases/{case_id}/recording` |
| Share case | `POST /api/share` |

### Processing a New Audio File

The frontend displays cases that have already been processed by the backend pipeline. To add a new case:

1. Go to **http://localhost:8000/docs**
2. Use the **`POST /api/process`** endpoint
3. Upload an audio file (WAV, MP3, M4A, etc.)
4. The pipeline will: transcribe → summarize → extract entities → save to `final_output/`
5. Refresh the frontend dashboard — the new case will appear

---

## Folder Structure

```
full stack copy/
├── Frontend/          # React + Vite + MUI frontend
│   ├── src/
│   │   ├── api/       # API client + mappers (talks to backend)
│   │   ├── components/
│   │   ├── pages/
│   │   └── types/
│   └── vite.config.ts # Proxy: /api → localhost:8000
│
├── pipeline/          # FastAPI backend
│   ├── app/
│   │   ├── api/       # Route handlers
│   │   ├── services/  # Whisper + Qwen AI services
│   │   ├── schemas/   # Pydantic models
│   │   └── utils/
│   ├── uploads/       # Saved audio files
│   ├── final_output/  # Processed case JSON files
│   └── requirements.txt
│
├── start-all.bat      # Launch both servers
├── start-backend.bat  # Launch backend only
└── start-frontend.bat # Launch frontend only
```
