from pathlib import Path
# from preprocess import AudioPreprocessor
from whisperr.transcriber import AudioTranscriber



#================================================================
#==================================================================
# import subprocess
# import os

# def normalize_and_resample_audio(input_file, temp_file="audio/temp.wav"):
#     """
#     Normalizes loudness, sets to mono, and resamples audio to 16000Hz using FFmpeg.
#     Then safely overwrites the original file.
#     """
#     # 1. Define the FFmpeg command as a list of arguments
#     ffmpeg_cmd = [
#         "ffmpeg", "-y",             # '-y' automatically overwrites the temp file if it exists
#         "-i", input_file,
#         "-af", "loudnorm",
#         "-ac", "1",
#         "-ar", "16000",
#         temp_file
#     ]
    
#     try:
#         print(f"Processing '{input_file}' with FFmpeg...")
#         # Run FFmpeg. check=True will raise an exception if FFmpeg fails.
#         subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
#         # 2. Safely replace the original file with the temp file
#         print("FFmpeg finished successfully. Replacing original file...")
#         os.replace(temp_file, input_file)
#         print(f"Success! '{input_file}' has been updated.")
        
#     except subprocess.CalledProcessError as e:
#         print(f"Error occurred during FFmpeg execution: {e}")
#         # Print the actual FFmpeg error log for debugging
#         print(e.stderr.decode('utf-8', errors='ignore'))
        
#     except FileNotFoundError:
#         print("Error: FFmpeg is not installed or not added to your system's PATH.")
        
#     except Exception as e:
#         print(f"An unexpected error occurred: {e}")

# # --- How to use it ---
# if __name__ == "__main__":
#     # Specify the path relative to where you run this python script
#     target_audio = "audio/audio4.wav" 
    
#     if os.path.exists(target_audio):
#         normalize_and_resample_audio(target_audio)
#     else:
#         print(f"Error: The file '{target_audio}' could not be found.")
#========================================================================
#========================================================================





# =====================================
# SELECT AUDIO FILE
# =====================================

# Original audio
AUDIO_FILE = Path("audio/audio5.wav")
# Original audio path


# Preprocess
# preprocessor = AudioPreprocessor()
# processed_audio = preprocessor.preprocess(
#     str(AUDIO_FILE)
# )
# processed audio path


# =====================================
# OUTPUT DIRECTORY
# =====================================

OUTPUT_FOLDER = Path(
    "output"
)

OUTPUT_FOLDER.mkdir(
    parents=True,
    exist_ok=True
)


# =====================================
# CREATE OUTPUT FILENAMES AUTOMATICALLY
# =====================================

# Example:
#
# cybercrime_call_1.mp3
#
# AUDIO_FILE.stem gives:
#
# cybercrime_call_1

audio_name = AUDIO_FILE.stem


PLAIN_TRANSCRIPT_FILE = (

    OUTPUT_FOLDER
    / f"{audio_name}_english.txt"

)


TIMESTAMP_FILE = (

    OUTPUT_FOLDER
    / f"{audio_name}_timestamped.txt"

)


# =====================================
# LOAD WHISPER
# =====================================

transcriber = AudioTranscriber(
    model_name="large-v3"
)


# =====================================
# TRANSCRIBE AND TRANSLATE
# =====================================

result = (
    transcriber.translate_to_english(
        str(AUDIO_FILE)
    )
)


# =====================================
# GET ENGLISH TRANSCRIPT
# =====================================

english_transcript = (
    result["text"].strip()
)


# =====================================
# PRINT TRANSCRIPT
# =====================================

print(
    "\nDetected language:",
    result["language"]
)


print(
    "\n========== ENGLISH TRANSCRIPT ==========\n"
)


print(
    english_transcript
)


# =====================================
# SAVE PLAIN ENGLISH TRANSCRIPT
# =====================================

with open(

    PLAIN_TRANSCRIPT_FILE,
    "w",
    encoding="utf-8"

) as file:

    file.write(
        english_transcript
    )


# =====================================
# SAVE TIMESTAMPED TRANSCRIPT
# =====================================

with open( 

    TIMESTAMP_FILE,
    "w",
    encoding="utf-8"

) as file:


    for segment in result["segments"]:
        start = segment["start"]
        end = segment["end"]

        text = (
            segment["text"]
            .strip()
        )

        file.write(
            f"[{start:.2f}s - "
            f"{end:.2f}s] "
            f"{text}\n"
        )


# =====================================
# SUCCESS MESSAGE
# =====================================

print(
    "\nEnglish transcript saved to:"
)


print(
    PLAIN_TRANSCRIPT_FILE.resolve()
)


print(
    "\nTimestamped transcript saved to:"
)


print(
    TIMESTAMP_FILE.resolve()
)