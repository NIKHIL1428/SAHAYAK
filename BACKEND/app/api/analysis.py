import logging

from fastapi import APIRouter, HTTPException, status

from app.schemas.request import AnalyzeRequest
from app.schemas.response import AnalyzeResponse
from app.services.analysis_service import analysis_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Analysis"])


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Analyze transcript text",
    description=(
        "Run Qwen summarization and regex entity extraction on a transcript "
        "and return structured analysis fields."
    ),
)
async def analyze_transcript(
    request: AnalyzeRequest,
) -> AnalyzeResponse:
    """Analyze transcript text without running Whisper transcription."""
    try:
        return analysis_service.analyze(request.transcript)

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Analysis request failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Analysis request failed. Please try again later.",
        ) from exc
