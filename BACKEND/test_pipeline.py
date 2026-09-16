from pathlib import Path
import json

# -----------------------------
# Whisper
# -----------------------------

# from whisper.preprocess import AudioPreprocessor
from whisperr.transcriber import AudioTranscriber

# -----------------------------
# Analysis
# -----------------------------

from analysis.summarizer import CybercrimeSummarizer
from analysis.extractor import EntityExtractor


# ===========================================
# AUDIO INPUT
# ===========================================

AUDIO_FILE = Path(
    "whisperr/audio/audio5.wav"
)

# ===========================================
# PREPROCESS
# ===========================================

# print("\nPreprocessing audio...\n")

# preprocessor = AudioPreprocessor()

# preprocessor.preprocess(
#     str(AUDIO_FILE)
# )

# ===========================================
# TRANSCRIPTION
# ===========================================

print("Transcribing audio...\n")

transcriber = AudioTranscriber()

result = transcriber.translate_to_english(
    str(AUDIO_FILE)
)

transcript = result["text"].strip()

# ===========================================
# SAVE TRANSCRIPT
# ===========================================

output_folder = Path(
    "final_output"
)

output_folder.mkdir(
    parents=True,
    exist_ok=True
)

transcript_file = (
    output_folder
    / f"{AUDIO_FILE.stem}_english.txt"
)

with open(
    transcript_file,
    "w",
    encoding="utf-8"
) as file:

    file.write(
        transcript
    )

print("Transcript saved.\n")

# ===========================================
# SUMMARIZATION
# ===========================================

print("Generating summary...\n")

summarizer = CybercrimeSummarizer()

summary = summarizer.summarize(
    transcript
)

# ===========================================
# ENTITY EXTRACTION
# ===========================================

print("Extracting entities...\n")

extractor = EntityExtractor()

entities = extractor.extract(
    transcript
)

# ===========================================
# MERGE
# ===========================================

final_result = {

    **summary,

    **entities

}

# ===========================================
# PRINT
# ===========================================

print("\n========== ENGLISH TRANSCRIPT ==========\n")

print(transcript)

print("\n========== ANALYSIS ==========\n")

print(

    json.dumps(

        final_result,

        indent=4,

        ensure_ascii=False

    )

)

# ===========================================
# SAVE JSON
# ===========================================

analysis_file = (

    output_folder

    / f"{AUDIO_FILE.stem}_analysis.json"

)

with open(

    analysis_file,

    "w",

    encoding="utf-8"

) as file:

    json.dump(

        final_result,

        file,

        indent=4,

        ensure_ascii=False

    )

print("\nAnalysis saved successfully.")