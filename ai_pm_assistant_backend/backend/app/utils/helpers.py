import re
from datetime import date
from typing import Any


def sanitize_string(value: str, max_length: int = 5000) -> str:
    """Strip leading/trailing whitespace and truncate to max_length."""
    return value.strip()[:max_length]


def today_iso() -> str:
    """Return today's date as ISO string (YYYY-MM-DD)."""
    return date.today().isoformat()


def build_error_response(detail: str, code: str = "INTERNAL_ERROR") -> dict[str, Any]:
    """Build a standardized error response body."""
    return {"error": {"code": code, "detail": detail}}


def is_valid_date(date_str: str) -> bool:
    """Check if a string is a valid ISO date (YYYY-MM-DD)."""
    pattern = r"^\d{4}-\d{2}-\d{2}$"
    return bool(re.match(pattern, date_str))
