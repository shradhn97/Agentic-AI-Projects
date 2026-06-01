import io
import logging
import pandas as pd
from app.models.jira import JiraAnalysisResponse
from app.services.gemini_service import generate_text_response

logger = logging.getLogger(__name__)

REQUIRED_COLUMNS = {"Issue Key", "Summary", "Status", "Assignee"}

# Status keyword mappings (case-insensitive)
DONE_KEYWORDS = {"done", "closed", "resolved", "completed", "released", "won't fix", "wont fix"}
IN_PROGRESS_KEYWORDS = {"in progress", "in review", "in development", "under review", "testing", "qa", "open"}
BLOCKED_KEYWORDS = {"blocked", "impediment", "on hold", "paused", "waiting", "deferred"}

RISK_SYSTEM_PROMPT = """
You are a senior Project Manager reviewing a Jira ticket summary for risk assessment.
Based on the statistics provided, write a concise 2-3 sentence risk summary suitable for a PMO status report.
Be direct and professional. Highlight key risks and suggest mitigation direction.
"""


def _classify_status(status: str) -> str:
    lower = status.strip().lower()
    if any(k in lower for k in BLOCKED_KEYWORDS):
        return "blocked"
    if any(k in lower for k in DONE_KEYWORDS):
        return "completed"
    return "inProgress"


async def analyze_jira_csv(file_bytes: bytes, filename: str) -> JiraAnalysisResponse:
    """Parse uploaded Jira CSV and return analysis with AI risk summary."""

    try:
        df = pd.read_csv(io.BytesIO(file_bytes))
    except Exception as exc:
        raise ValueError(f"Failed to parse CSV file '{filename}': {exc}") from exc

    # Normalize column names: strip whitespace
    df.columns = [c.strip() for c in df.columns]

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(
            f"CSV is missing required columns: {', '.join(sorted(missing))}. "
            f"Found columns: {', '.join(df.columns.tolist())}"
        )

    total = len(df)
    completed = 0
    in_progress = 0
    blocked = 0

    for status_val in df["Status"].fillna("Unknown").astype(str):
        category = _classify_status(status_val)
        if category == "completed":
            completed += 1
        elif category == "blocked":
            blocked += 1
        else:
            in_progress += 1

    # Build risk prompt
    assignee_counts = df["Assignee"].fillna("Unassigned").value_counts().head(5).to_dict()
    assignee_summary = ", ".join(f"{k}: {v} tickets" for k, v in assignee_counts.items())

    risk_prompt = f"""
Jira Project Analysis:
- Total Tickets: {total}
- Completed: {completed} ({round(completed / total * 100, 1) if total else 0}%)
- In Progress: {in_progress} ({round(in_progress / total * 100, 1) if total else 0}%)
- Blocked: {blocked} ({round(blocked / total * 100, 1) if total else 0}%)
- Top Assignees: {assignee_summary}

Write a 2-3 sentence PMO-level risk summary.
"""

    risk_summary = await generate_text_response(
        system_prompt=RISK_SYSTEM_PROMPT,
        user_prompt=risk_prompt,
    )

    logger.info(
        "Jira analysis complete: total=%d, completed=%d, in_progress=%d, blocked=%d",
        total, completed, in_progress, blocked,
    )

    return JiraAnalysisResponse(
        totalTickets=total,
        completed=completed,
        inProgress=in_progress,
        blocked=blocked,
        riskSummary=risk_summary,
    )
