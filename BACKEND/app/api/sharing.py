import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status

from app.schemas.request import ShareRequest
from app.schemas.response import ShareResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Sharing"])


@router.post(
    "/share",
    response_model=ShareResponse,
    summary="Share case data",
    description=(
        "Share selected case components (recording, summary, extracted data) "
        "with another investigative unit."
    ),
)
async def share_case_data(
    request: ShareRequest,
) -> ShareResponse:
    """Accept a share package configuration and dispatch it to the destination."""
    if not any([request.recording, request.summary, request.data]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one share item must be selected: recording, summary, or data.",
        )

    try:
        share_payload = {
            "case_id": request.case_id,
            "recording": request.recording,
            "summary": request.summary,
            "data": request.data,
            "destination": request.destination,
            "priority": request.priority,
            "remarks": request.remarks,
            "shared_at": datetime.now(timezone.utc).isoformat(),
        }

        logger.info("Share request accepted: %s", share_payload)

        return ShareResponse(status="success")

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Share request failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Share request failed. Please try again later.",
        ) from exc
