import logging
from pathlib import Path

from fastapi import HTTPException, status

from whisperr.transcriber import AudioTranscriber

logger = logging.getLogger(__name__)


class WhisperService:
    """Service wrapper around the existing Whisper transcription module."""

    def __init__(self, model_name: str = "large-v3") -> None:
        self._model_name = model_name
        self._transcriber: AudioTranscriber | None = None

    def _get_transcriber(self) -> AudioTranscriber:
        """Lazily initialize the Whisper transcriber."""
        if self._transcriber is None:
            logger.info("Initializing Whisper model: %s", self._model_name)
            self._transcriber = AudioTranscriber(model_name=self._model_name)

        return self._transcriber

    def transcribe(self, audio_path: str | Path) -> str:
        """
        Transcribe and translate audio to English.

        Returns the transcript text.
        """
        audio_file = Path(audio_path)

        if not audio_file.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Audio file not found: {audio_file.name}",
            )

        try:
            transcriber = self._get_transcriber()
            result = transcriber.translate_to_english(str(audio_file))
            transcript = result.get("text", "").strip()

            if not transcript:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Whisper returned an empty transcript.",
                )

            return transcript

        except HTTPException:
            raise

        except FileNotFoundError as exc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(exc),
            ) from exc

        except Exception as exc:
            logger.exception("Whisper transcription failed for %s", audio_file.name)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Transcription failed. Please try again later.",
            ) from exc


whisper_service = WhisperService()
