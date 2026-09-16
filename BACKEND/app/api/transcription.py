import logging
from datetime import datetime, timezone

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.schemas.response import EntityFields, ProcessResponse, SummaryFields, TranscribeResponse
from app.services.analysis_service import analysis_service
from app.services.whisper_service import whisper_service
from app.utils.file_handler import (
    FINAL_OUTPUT_DIR,
    generate_case_id,
    save_case_json,
    save_transcript,
    save_uploaded_audio,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Transcription"])


@router.post(
    "/transcribe",
    response_model=TranscribeResponse,
    summary="Transcribe audio to English",
    description="Upload an audio file and receive only the English transcript.",
)
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file to transcribe"),
) -> TranscribeResponse:
    """Transcribe an uploaded audio file without running analysis."""
    case_id = generate_case_id()

    try:
        audio_path, _ = await save_uploaded_audio(file, case_id)
        transcript = whisper_service.transcribe(audio_path)
        return TranscribeResponse(transcript=transcript)

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Transcription request failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Transcription request failed. Please try again later.",
        ) from exc


@router.post(
    "/process",
    response_model=ProcessResponse,
    summary="Run full audio processing pipeline",
    description=(
        "Upload an audio file to transcribe it, summarize the complaint, "
        "extract entities, save results, and return the complete case JSON."
    ),
)
async def process_audio(
    file: UploadFile = File(..., description="Audio file to process"),
) -> ProcessResponse:
    """Run the complete Whisper + Qwen + regex extraction pipeline."""
    case_id = generate_case_id()
    processed_at = datetime.now(timezone.utc)

    try:
        audio_path, audio_file = await save_uploaded_audio(file, case_id)

        transcript = whisper_service.transcribe(audio_path)
        save_transcript(case_id, transcript)

        analysis = analysis_service.analyze(transcript)
        summary = SummaryFields(**analysis.model_dump())
        entities = EntityFields(**analysis.model_dump())

        payload = {
            "transcript": transcript,
            **analysis.model_dump(),
        }

        output_path = save_case_json(
            case_id=case_id,
            payload=payload,
            audio_file=audio_file,
        )

        return ProcessResponse(
            case_id=case_id,
            audio_file=audio_file,
            transcript=transcript,
            summary=summary,
            entities=entities,
            output_file=str(output_path.relative_to(FINAL_OUTPUT_DIR.parent)),
            processed_at=processed_at,
        )

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Pipeline processing failed for case %s", case_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Pipeline processing failed. Please try again later.",
        ) from exc
