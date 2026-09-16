from pathlib import Path
import subprocess


class AudioPreprocessor:

    def preprocess(self, input_audio: str):

        input_audio = Path(input_audio)

        temp_audio = input_audio.parent / "temp.wav"

        # ---------------------------------------
        # Step 1
        # Convert to Mono + 16 kHz
        # ---------------------------------------

        command1 = [

            "ffmpeg",
            "-y",
            "-i",
            str(input_audio),
            "-ac",
            "1",
            "-ar",
            "16000",
            str(temp_audio)

        ]

        subprocess.run(
            command1,
            check=True
        )

        temp_audio.replace(input_audio)

        # ---------------------------------------
        # Step 2
        # Loudness Normalization
        # ---------------------------------------

        command2 = [

            "ffmpeg",
            "-y",
            "-i",
            str(input_audio),
            "-af",
            "loudnorm",
            "-ac",
            "1",
            "-ar",
            "16000",
            str(temp_audio)

        ]

        subprocess.run(
            command2,
            check=True
        )

        temp_audio.replace(input_audio)

        return input_audio