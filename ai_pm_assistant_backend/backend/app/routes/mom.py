import logging
from fastapi import APIRouter, HTTPException, status
from app.models.mom import MoMRequest, MoMResponse
from app.services.mom_service import generate_mom

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/mom", tags=["Minutes of Meeting"])


@router.post(
    "/generate",
    response_model=MoMResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate structured Minutes of Meeting",
    description=(
        "Accepts raw meeting notes and returns a fully structured MoM document "
        "with attendees, discussion points, action items, and an executive summary — "
        "powered by Gemini 2.5 Flash."
    ),
)
async def generate_mom_endpoint(request: MoMRequest) -> MoMResponse:
    if not request.meetingNotes.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="meetingNotes cannot be empty.",
        )

    try:
        return await generate_mom(request)
    except ValueError as exc:
        logger.warning("MoM validation error: %s", exc)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    except RuntimeError as exc:
        logger.error("MoM generation failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
