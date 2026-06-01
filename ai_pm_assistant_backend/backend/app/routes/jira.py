import logging
from fastapi import APIRouter, File, HTTPException, UploadFile, status
from app.models.jira import JiraAnalysisResponse
from app.services.jira_service import analyze_jira_csv

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/jira", tags=["Jira Analyzer"])

MAX_FILE_SIZE_MB = 10
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


@router.post(
    "/analyze",
    response_model=JiraAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze a Jira CSV export",
    description=(
        "Upload a Jira CSV export (must contain: Issue Key, Summary, Status, Assignee). "
        "Returns ticket counts by status and an AI-generated risk summary."
    ),
)
async def analyze_jira_endpoint(
    file: UploadFile = File(..., description="Jira CSV export file"),
) -> JiraAnalysisResponse:
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Only .csv files are accepted.",
        )

    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds {MAX_FILE_SIZE_MB} MB limit.",
        )

    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Uploaded file is empty.",
        )

    try:
        return await analyze_jira_csv(file_bytes, file.filename)
    except ValueError as exc:
        logger.warning("Jira CSV validation error: %s", exc)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    except RuntimeError as exc:
        logger.error("Jira analysis failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
