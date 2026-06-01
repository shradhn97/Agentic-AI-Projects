# AI Project Manager Assistant — Backend

> FastAPI backend powered by **Google Gemini 2.5 Flash**  
> Built for: Sanghars Mohanty, Project Manager @ iServeU Technologies

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Python 3.12 |
| Framework | FastAPI 0.115 |
| AI Engine | Google Gemini 2.5 Flash |
| Validation | Pydantic v2 |
| Data Processing | Pandas 2.2 |
| Server | Uvicorn |

---

## 1. Installation

### Prerequisites
- Python 3.12+
- A valid [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Clone / Download
```bash
cd backend
```

---

## 2. Virtual Environment Setup

**Windows**
```cmd
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux**
```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Environment Variables

Copy the example file and fill in your Gemini API key:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `.env` and set:
```env
GEMINI_API_KEY=your_actual_key_here
```

---

## 5. Run Commands

### Option A — Windows (one click)
```cmd
run.bat
```

### Option B — Manual
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Option C — Production (no reload)
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The server starts at: **http://localhost:8000**

---

## 6. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/v1/mom/generate` | Generate Minutes of Meeting |
| POST | `/api/v1/user-story/generate` | Generate Agile User Story |
| POST | `/api/v1/jira/analyze` | Analyze Jira CSV export |
| GET | `/api/v1/dashboard/summary` | Dashboard summary counters |

### Swagger UI
```
http://localhost:8000/docs
```

### ReDoc
```
http://localhost:8000/redoc
```

---

## 7. Example Requests

### Health Check
```bash
curl http://localhost:8000/
```
```json
{ "status": "running", "project": "AI Project Manager Assistant", "version": "1.0.0" }
```

---

### Generate MoM
```bash
curl -X POST http://localhost:8000/api/v1/mom/generate \
  -H "Content-Type: application/json" \
  -d '{
    "meetingName": "Debit Card Discussion",
    "meetingDate": "2026-06-01",
    "meetingNotes": "Attendees: Sanghars (PM), Rahul (Dev), Priya (QA). Discussed embossa file format issues. Action: Rahul to fix file naming by June 5. Priya to retest by June 7. Decision: No QA bypass in production going forward."
  }'
```

---

### Generate User Story
```bash
curl -X POST http://localhost:8000/api/v1/user-story/generate \
  -H "Content-Type: application/json" \
  -d '{
    "requirement": "Merchant should be able to view QR details including transaction history and settlement status."
  }'
```

---

### Analyze Jira CSV
```bash
curl -X POST http://localhost:8000/api/v1/jira/analyze \
  -F "file=@jira_export.csv"
```

Required CSV columns: `Issue Key`, `Summary`, `Status`, `Assignee`

Sample CSV:
```csv
Issue Key,Summary,Status,Assignee
TAV2-100,Card issuance API,Done,Rahul
TAV2-101,Embossa file naming,In Progress,Sanghars
TAV2-102,QA bypass fix,Blocked,Priya
```

---

### Dashboard Summary
```bash
curl http://localhost:8000/api/v1/dashboard/summary
```
```json
{
  "totalMeetingsProcessed": 3,
  "totalStoriesGenerated": 5,
  "totalActionItems": 12,
  "openActionItems": 8
}
```

---

## 8. Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, routes registration
│   ├── config.py            # Settings from .env (pydantic-settings)
│   ├── state.py             # In-memory dashboard counters
│   ├── routes/
│   │   ├── mom.py           # POST /api/v1/mom/generate
│   │   ├── user_story.py    # POST /api/v1/user-story/generate
│   │   ├── jira.py          # POST /api/v1/jira/analyze
│   │   └── dashboard.py     # GET  /api/v1/dashboard/summary
│   ├── services/
│   │   ├── gemini_service.py    # Centralized Gemini 2.5 Flash client
│   │   ├── mom_service.py       # MoM generation logic
│   │   ├── user_story_service.py
│   │   └── jira_service.py      # CSV parsing + risk analysis
│   ├── prompts/
│   │   ├── mom_prompt.py        # Gemini prompts for MoM
│   │   └── user_story_prompt.py
│   ├── models/
│   │   ├── mom.py               # Pydantic request/response models
│   │   ├── user_story.py
│   │   └── jira.py
│   └── utils/
│       └── helpers.py           # Shared utility functions
├── .env.example             # Environment variable template
├── requirements.txt
├── run.bat                  # Windows one-click launcher
└── README.md
```

---

## 9. Notes for Production

- Replace in-memory `state.py` counters with Redis or PostgreSQL
- Set `ALLOWED_ORIGINS` in `config.py` to your production frontend domain
- Use `--workers 4` with Uvicorn behind Nginx
- Add JWT/API key authentication middleware for all `/api/v1/*` routes
- Store `GEMINI_API_KEY` in environment secrets (not `.env` file) in CI/CD

---

*Built by Sanghars Mohanty | iServeU Technologies Pvt. Ltd. | Bhubaneswar*
