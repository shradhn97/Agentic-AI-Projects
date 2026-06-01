import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.routes import mom, user_story, jira, dashboard

# ─── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


# ─── Lifespan ───────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("🚀 Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    logger.info("📄 Swagger UI: http://localhost:8000/docs")
    logger.info("📄 ReDoc:      http://localhost:8000/redoc")
    yield
    logger.info("🛑 Shutting down %s", settings.APP_NAME)


# ─── App ─────────────────────────────────────────────────────────────────────
settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "AI-powered Project Manager Assistant backend. "
        "Generates MoM, User Stories, analyzes Jira CSVs, and provides dashboard insights "
        "— all powered by Google Gemini 2.5 Flash."
    ),
    contact={
        "name": "Sanghars Mohanty",
        "email": "sanghars@iserveU.com",
    },
    license_info={"name": "Proprietary"},
    lifespan=lifespan,
)

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to settings.ALLOWED_ORIGINS in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ──────────────────────────────────────────────────────────────────
app.include_router(mom.router)
app.include_router(user_story.router)
app.include_router(jira.router)
app.include_router(dashboard.router)


# ─── Health Check ────────────────────────────────────────────────────────────
@app.get(
    "/",
    tags=["Health"],
    summary="Health check",
    description="Returns server status and project name.",
)
async def health_check():
    return JSONResponse(
        content={
            "status": "running",
            "project": settings.APP_NAME,
            "version": settings.APP_VERSION,
        }
    )


# ─── Global Exception Handler ────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "INTERNAL_SERVER_ERROR", "detail": "An unexpected error occurred."}},
    )
