from google import genai

from ai.config.settings import GEMINI_API_KEY, MODEL_NAME


class GeminiProvider:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)

    def generate(self, prompt: str) -> str:
        response = self.client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )

        return response.text