import logging
from pathlib import Path

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from app.database.database import case_repository
from app.schemas.response import CaseDetailResponse, CaseListResponse
from app.utils.file_handler import UPLOADS_DIR

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Cases"])


@router.get(
    "/cases",
    response_model=CaseListResponse,
    summary="List all processed cases",
    description="Return all cases saved in final_output/.",
)
async def list_cases() -> CaseListResponse:
    """Return a summary list of all processed cases."""
    try:
        return case_repository.get_all_cases()

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Failed to list cases")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve cases. Please try again later.",
        ) from exc


@router.get(
    "/cases/{case_id}",
    response_model=CaseDetailResponse,
    summary="Get case details",
    description="Return complete details for a single processed case.",
)
async def get_case(case_id: str) -> CaseDetailResponse:
    """Return full case details by case ID."""
    try:
        return case_repository.get_case_by_id(case_id)

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Failed to retrieve case %s", case_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve case details. Please try again later.",
        ) from exc


@router.get(
    "/cases/{case_id}/recording",
    summary="Download case recording",
    description="Stream the saved audio file for a processed case.",
)
async def get_case_recording(case_id: str) -> FileResponse:
    """Return the audio file associated with a processed case."""
    try:
        case = case_repository.get_case_by_id(case_id)
        audio_path = Path(case.audio_path)

        if not audio_path.is_file():
            fallback = UPLOADS_DIR / case.audio_file
            if fallback.is_file():
                audio_path = fallback
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Recording for case '{case_id}' not found.",
                )

        return FileResponse(
            path=audio_path,
            filename=case.audio_file,
            media_type="application/octet-stream",
        )

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Failed to retrieve recording for case %s", case_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve case recording. Please try again later.",
        ) from exc
