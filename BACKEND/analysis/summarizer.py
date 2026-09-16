import json

from ollama import chat

from analysis.prompts import (
    SYSTEM_PROMPT,
    build_user_prompt
)


MODEL_NAME = "qwen3:14b"


class CybercrimeSummarizer:

    def __init__(
        self,
        model=MODEL_NAME
    ):

        self.model = model


    def summarize(
        self,
        transcript: str
    ):

        response = chat(

            model=self.model,

            messages=[

                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },

                {
                    "role": "user",
                    "content": build_user_prompt(
                        transcript
                    )
                }

            ]

        )


        text = response["message"]["content"]


        try:

            return json.loads(text)

        except json.JSONDecodeError:

            print("\nInvalid JSON returned by Qwen:\n")

            print(text)

            raise ValueError(
                "Qwen returned invalid JSON."
            )