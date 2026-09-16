from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class SummaryFields(BaseModel):
    """Structured summary produced by the Qwen summarizer."""

    summary: str = Field(default="Not Mentioned")
    fraud_type: str = Field(default="Not Mentioned")
    victim_action: str = Field(default="Not Mentioned")
    suspect_action: str = Field(default="Not Mentioned")
    money_lost: str = Field(default="Not Mentioned")
    bank_name: str = Field(default="Not Mentioned")
    final_outcome: str = Field(default="Not Mentioned")


class EntityFields(BaseModel):
    """Entities extracted via regex from the transcript."""

    phone_numbers: list[str] = Field(default_factory=list)
    upi_ids: list[str] = Field(default_factory=list)
    pan_numbers: list[str] = Field(default_factory=list)
    aadhaar_numbers: list[str] = Field(default_factory=list)
    emails: list[str] = Field(default_factory=list)
    urls: list[str] = Field(default_factory=list)
    amounts: list[str] = Field(default_factory=list)
    ifsc_codes: list[str] = Field(default_factory=list)
    bank_account_numbers: list[str] = Field(default_factory=list)
    transaction_ids: list[str] = Field(default_factory=list)


class TranscribeResponse(BaseModel):
    """Response for POST /api/transcribe."""

    transcript: str = Field(..., description="English transcript of the audio file")


class AnalyzeResponse(SummaryFields, EntityFields):
    """Response for POST /api/analyze."""


class ProcessResponse(BaseModel):
    """Response for POST /api/process — full pipeline output."""

    case_id: str = Field(..., description="Unique identifier for the processed case")
    audio_file: str = Field(..., description="Saved audio filename")
    transcript: str = Field(..., description="English transcript")
    summary: SummaryFields
    entities: EntityFields
    output_file: str = Field(..., description="Path to the saved JSON result file")
    processed_at: datetime = Field(..., description="UTC timestamp when processing completed")


class CaseSummary(BaseModel):
    """Lightweight case record for listing endpoints."""

    case_id: str
    audio_file: str
    fraud_type: str = Field(default="Not Mentioned")
    processed_at: datetime
    output_file: str


class CaseListResponse(BaseModel):
    """Response for GET /api/cases."""

    cases: list[CaseSummary]
    total: int


class CaseDetailResponse(BaseModel):
    """Response for GET /api/cases/{case_id}."""

    case_id: str
    audio_file: str
    audio_path: str
    transcript: str
    summary: SummaryFields
    entities: EntityFields
    output_file: str
    processed_at: datetime


class ShareResponse(BaseModel):
    """Response for POST /api/share."""

    status: str = Field(default="success", examples=["success"])


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str
    error_type: str | None = None


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = "ok"
    service: str = "cybercrime-pipeline-api"
