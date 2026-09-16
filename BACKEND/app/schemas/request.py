from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    """Request body for transcript analysis."""

    transcript: str = Field(
        ...,
        min_length=1,
        description="Transcript text to analyze",
        examples=["The victim received a fraudulent call claiming to be from their bank."],
    )


class ShareRequest(BaseModel):
    """Request body for sharing case data with another unit."""

    case_id: str | None = Field(
        default=None,
        description="Case identifier being shared",
        examples=["DL-CY-2026-A1B2C3D4"],
    )
    recording: bool = Field(
        default=False,
        description="Include voice recording in the share package",
    )
    summary: bool = Field(
        default=False,
        description="Include conversation summary in the share package",
    )
    data: bool = Field(
        default=False,
        description="Include extracted entity data in the share package",
    )
    destination: str = Field(
        ...,
        min_length=1,
        description="Destination branch or investigative unit",
        examples=["Crime Branch"],
    )
    priority: str | None = Field(
        default=None,
        description="Forwarding priority level",
        examples=["Normal"],
    )
    remarks: str | None = Field(
        default=None,
        description="Optional forwarding instructions or context",
    )
