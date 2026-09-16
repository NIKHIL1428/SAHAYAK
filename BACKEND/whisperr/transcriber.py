from pathlib import Path

import torch
import whisper


# DOMAIN_PROMPT = Path(
#     "prompts/prompt1.txt"
# ).read_text(encoding="utf-8")


class AudioTranscriber:

    def __init__(
        self,
        model_name: str = "large-v3"
    ):

        # Your Intel laptop will use CPU.
        self.device = (
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )

        print(
            f"Whisper device: {self.device}"
        )

        print(
            f"Loading Whisper {model_name}..."
        )

        # Downloads large-v3 automatically
        # during the first execution.
        self.model = whisper.load_model(
            model_name,
            device=self.device
        )

        print(
            "Whisper model loaded successfully."
        )


    def translate_to_english(
        self,
        audio_path: str
    ) -> dict:

        audio_file = Path(audio_path)

        if not audio_file.exists():

            raise FileNotFoundError(
                f"Audio file not found: "
                f"{audio_file.resolve()}"
            )


        print(
            f"\nProcessing: {audio_file.name}"
        )

        result = self.model.transcribe(

            str(audio_file),
            task="translate",
            language=None,
            fp16=(self.device == "cuda"),
            beam_size=5,

            temperature=(0.0, 0.2, 0.4, 0.6, 0.8, 1.0),
            condition_on_previous_text=False,
            compression_ratio_threshold=2.4,
            logprob_threshold=-1.0,
            no_speech_threshold=0.6,
            
            # temperature=0,
            # condition_on_previous_text=True,
            # #initial_prompt=DOMAIN_PROMPT,
            verbose=True

        )

        return result