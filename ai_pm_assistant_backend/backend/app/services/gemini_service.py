import json
import re
import logging
from google import genai
from google.genai import types
from app.config import get_settings

logger = logging.getLogger(__name__)

_client: genai.Client | None = None
MODEL_ID = "gemini-2.5-flash"


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        settings = get_settings()
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def _extract_json(text: str) -> str:
    """Strip markdown code fences and extract raw JSON string."""
    text = text.strip()
    # Remove ```json ... ``` or ``` ... ```
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        return match.group(1).strip()
    return text


async def generate_structured_response(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.2,
) -> dict:
    """
    Call Gemini 2.5 Flash with a system + user prompt.
    Always expects a JSON response — raises ValueError if parsing fails.
    """
    client = _get_client()

    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=temperature,
                response_mime_type="application/json",
            ),
        )

        raw_text = response.text
        logger.debug("Gemini raw response: %s", raw_text)

        cleaned = _extract_json(raw_text)
        return json.loads(cleaned)

    except json.JSONDecodeError as exc:
        logger.error("JSON decode error from Gemini response: %s", exc)
        raise ValueError(f"Gemini returned non-JSON response: {exc}") from exc
    except Exception as exc:
        logger.error("Gemini API error: %s", exc)
        raise RuntimeError(f"Gemini API call failed: {exc}") from exc


async def generate_text_response(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.3,
) -> str:
    """Call Gemini 2.5 Flash and return plain text response."""
    client = _get_client()

    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=temperature,
            ),
        )
        return response.text.strip()

    except Exception as exc:
        logger.error("Gemini API error: %s", exc)
        raise RuntimeError(f"Gemini API call failed: {exc}") from exc
