import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import analysis, cases, sharing, transcription
from app.schemas.response import ErrorResponse, HealthResponse
from app.utils.file_handler import ensure_directories

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

FRONTEND_ORIGIN = "http://localhost:5173"


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Application startup and shutdown hooks."""
    ensure_directories()
    logger.info("Cybercrime Pipeline API started")
    yield
    logger.info("Cybercrime Pipeline API stopped")


app = FastAPI(
    title="Cybercrime Pipeline API",
    description=(
        "FastAPI backend for cybercrime complaint processing. "
        "Transcribes audio with Whisper, summarizes complaints with Qwen, "
        "and extracts entities using regex patterns."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcription.router)
app.include_router(analysis.router)
app.include_router(cases.router)
app.include_router(sharing.router)


@app.exception_handler(HTTPException)
async def http_exception_handler(
    _: Request,
    exc: HTTPException,
) -> JSONResponse:
    """Return consistent JSON error responses for HTTP exceptions."""
    error = ErrorResponse(
        detail=str(exc.detail),
        error_type=exc.__class__.__name__,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error.model_dump(),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    _: Request,
    exc: Exception,
) -> JSONResponse:
    """Catch unexpected server errors."""
    logger.exception("Unhandled server error")
    error = ErrorResponse(
        detail="An unexpected server error occurred.",
        error_type=exc.__class__.__name__,
    )
    return JSONResponse(
        status_code=500,
        content=error.model_dump(),
    )


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Health check",
)
async def health_check() -> HealthResponse:
    """Simple health check endpoint."""
    return HealthResponse()
