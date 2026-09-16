import json
from datetime import datetime
from pathlib import Path

from fastapi import HTTPException, status

from app.schemas.response import (
    CaseDetailResponse,
    CaseListResponse,
    CaseSummary,
    EntityFields,
    SummaryFields,
)
from app.utils.file_handler import FINAL_OUTPUT_DIR, list_case_files, load_case_json

SUMMARY_KEYS = {
    "summary",
    "fraud_type",
    "victim_action",
    "suspect_action",
    "money_lost",
    "bank_name",
    "final_outcome",
}

ENTITY_KEYS = {
    "phone_numbers",
    "upi_ids",
    "pan_numbers",
    "aadhaar_numbers",
    "emails",
    "urls",
    "amounts",
    "ifsc_codes",
    "bank_account_numbers",
    "transaction_ids",
}


def _parse_datetime(value: str | datetime) -> datetime:
    """Parse an ISO timestamp into a datetime object."""
    if isinstance(value, datetime):
        return value

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Invalid processed_at timestamp: {value}",
        ) from exc


def _extract_summary(data: dict) -> SummaryFields:
    """Build summary fields from a stored case record."""
    return SummaryFields(
        **{key: data.get(key, "Not Mentioned") for key in SUMMARY_KEYS}
    )


def _extract_entities(data: dict) -> EntityFields:
    """Build entity fields from a stored case record."""
    return EntityFields(
        **{key: data.get(key, []) for key in ENTITY_KEYS}
    )


def _load_case_record(case_path: Path) -> dict:
    """Load and validate a case JSON file."""
    try:
        with case_path.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Corrupted case file: {case_path.name}",
        ) from exc

    if not isinstance(data, dict):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Invalid case file format: {case_path.name}",
        )

    return data


class CaseRepository:
    """Read-only repository backed by JSON files in final_output/."""

    def get_all_cases(self) -> CaseListResponse:
        """Return all processed cases."""
        cases: list[CaseSummary] = []

        for case_path in list_case_files():
            data = _load_case_record(case_path)

            case_id = data.get("case_id") or case_path.stem.replace("_analysis", "")

            cases.append(
                CaseSummary(
                    case_id=case_id,
                    audio_file=data.get("audio_file", "unknown"),
                    fraud_type=data.get("fraud_type", "Not Mentioned"),
                    processed_at=_parse_datetime(
                        data.get("processed_at", datetime.now().isoformat())
                    ),
                    output_file=str(case_path.relative_to(FINAL_OUTPUT_DIR.parent)),
                )
            )

        return CaseListResponse(cases=cases, total=len(cases))

    def get_case_by_id(self, case_id: str) -> CaseDetailResponse:
        """Return complete details for a single case."""
        data = load_case_json(case_id)
        output_file = str(
            (FINAL_OUTPUT_DIR / f"{case_id}_analysis.json").relative_to(
                FINAL_OUTPUT_DIR.parent
            )
        )

        transcript = data.get("transcript", "")

        if not transcript:
            transcript_path = FINAL_OUTPUT_DIR / f"{case_id}_english.txt"
            if transcript_path.exists():
                transcript = transcript_path.read_text(encoding="utf-8")

        return CaseDetailResponse(
            case_id=data.get("case_id", case_id),
            audio_file=data.get("audio_file", "unknown"),
            audio_path=data.get("audio_path", ""),
            transcript=transcript,
            summary=_extract_summary(data),
            entities=_extract_entities(data),
            output_file=output_file,
            processed_at=_parse_datetime(
                data.get("processed_at", datetime.now().isoformat())
            ),
        )


case_repository = CaseRepository()
