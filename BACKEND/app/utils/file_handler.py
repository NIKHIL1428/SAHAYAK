import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

PIPELINE_ROOT = Path(__file__).resolve().parent.parent.parent
UPLOADS_DIR = PIPELINE_ROOT / "uploads"
FINAL_OUTPUT_DIR = PIPELINE_ROOT / "final_output"

ALLOWED_AUDIO_EXTENSIONS = {
    ".wav",
    ".mp3",
    ".m4a",
    ".ogg",
    ".flac",
    ".webm",
    ".mp4",
    ".mpeg",
    ".mpga",
}


def ensure_directories() -> None:
    """Create required storage directories if they do not exist."""
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    FINAL_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def generate_case_id() -> str:
    """Generate a unique case identifier."""
    year = datetime.now(timezone.utc).year
    suffix = uuid.uuid4().hex[:8].upper()
    return f"DL-CY-{year}-{suffix}"


def sanitize_filename(filename: str) -> str:
    """Return a filesystem-safe version of the original filename."""
    name = Path(filename).name
    safe_name = re.sub(r"[^\w.\-]", "_", name)
    return safe_name or "audio_upload"


def validate_audio_extension(filename: str) -> str:
    """Validate the uploaded file extension and return it."""
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Unsupported audio format '{extension or 'unknown'}'. "
                f"Allowed formats: {', '.join(sorted(ALLOWED_AUDIO_EXTENSIONS))}"
            ),
        )

    return extension


async def save_uploaded_audio(
    upload_file: UploadFile,
    case_id: str,
) -> tuple[Path, str]:
    """
    Save an uploaded audio file into uploads/.

    Returns the saved file path and the stored filename.
    """
    if not upload_file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must include a filename.",
        )

    ensure_directories()

    extension = validate_audio_extension(upload_file.filename)
    safe_original_name = sanitize_filename(upload_file.filename)
    stored_filename = f"{case_id}_{safe_original_name}"
    destination = UPLOADS_DIR / stored_filename

    if destination.suffix.lower() != extension:
        destination = destination.with_suffix(extension)

    content = await upload_file.read()

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded audio file is empty.",
        )

    destination.write_bytes(content)

    return destination, destination.name


def save_transcript(case_id: str, transcript: str) -> Path:
    """Persist the English transcript as a text file in final_output/."""
    ensure_directories()

    transcript_path = FINAL_OUTPUT_DIR / f"{case_id}_english.txt"
    transcript_path.write_text(transcript, encoding="utf-8")

    return transcript_path


def save_case_json(
    case_id: str,
    payload: dict,
    audio_file: str,
) -> Path:
    """
    Save the combined pipeline result as JSON in final_output/.

    Metadata fields are added so cases can be listed and retrieved later.
    """
    ensure_directories()

    processed_at = datetime.now(timezone.utc).isoformat()

    case_record = {
        "case_id": case_id,
        "audio_file": audio_file,
        "audio_path": str(UPLOADS_DIR / audio_file),
        "processed_at": processed_at,
        **payload,
    }

    output_path = FINAL_OUTPUT_DIR / f"{case_id}_analysis.json"

    with output_path.open("w", encoding="utf-8") as file:
        json.dump(case_record, file, indent=4, ensure_ascii=False)

    return output_path


def load_case_json(case_id: str) -> dict:
    """Load a saved case JSON file from final_output/."""
    case_path = FINAL_OUTPUT_DIR / f"{case_id}_analysis.json"

    if not case_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id}' not found.",
        )

    with case_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def list_case_files() -> list[Path]:
    """Return all saved case analysis JSON files."""
    ensure_directories()
    return sorted(
        FINAL_OUTPUT_DIR.glob("*_analysis.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )
