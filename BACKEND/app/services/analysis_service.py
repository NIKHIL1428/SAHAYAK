import logging

from fastapi import HTTPException, status

from analysis.extractor import EntityExtractor
from analysis.summarizer import CybercrimeSummarizer
from app.schemas.response import AnalyzeResponse, EntityFields, SummaryFields

logger = logging.getLogger(__name__)


class AnalysisService:
    """Service wrapper around the existing Qwen summarizer and regex extractor."""

    def __init__(self) -> None:
        self._summarizer: CybercrimeSummarizer | None = None
        self._extractor: EntityExtractor | None = None

    def _get_summarizer(self) -> CybercrimeSummarizer:
        """Lazily initialize the Qwen summarizer."""
        if self._summarizer is None:
            logger.info("Initializing CybercrimeSummarizer")
            self._summarizer = CybercrimeSummarizer()

        return self._summarizer

    def _get_extractor(self) -> EntityExtractor:
        """Lazily initialize the regex entity extractor."""
        if self._extractor is None:
            logger.info("Initializing EntityExtractor")
            self._extractor = EntityExtractor()

        return self._extractor

    def summarize(self, transcript: str) -> SummaryFields:
        """Generate structured summary fields from a transcript."""
        if not transcript.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Transcript cannot be empty.",
            )

        try:
            summarizer = self._get_summarizer()
            summary_data = summarizer.summarize(transcript)
            return SummaryFields(**summary_data)

        except ValueError as exc:
            logger.exception("Qwen returned invalid summary JSON")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=str(exc),
            ) from exc

        except Exception as exc:
            logger.exception("Summarization failed")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Summarization failed. Please try again later.",
            ) from exc

    def extract_entities(self, transcript: str) -> EntityFields:
        """Extract regex-based entities from a transcript."""
        if not transcript.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Transcript cannot be empty.",
            )

        try:
            extractor = self._get_extractor()
            entity_data = extractor.extract(transcript)
            return EntityFields(**entity_data)

        except Exception as exc:
            logger.exception("Entity extraction failed")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Entity extraction failed. Please try again later.",
            ) from exc

    def analyze(self, transcript: str) -> AnalyzeResponse:
        """Run summarization and entity extraction, then combine results."""
        summary = self.summarize(transcript)
        entities = self.extract_entities(transcript)

        return AnalyzeResponse(
            **summary.model_dump(),
            **entities.model_dump(),
        )


analysis_service = AnalysisService()
