import logging
from fastapi import APIRouter, HTTPException, status
from app.models.user_story import UserStoryRequest, UserStoryResponse
from app.services.user_story_service import generate_user_story

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/user-story", tags=["User Story"])


@router.post(
    "/generate",
    response_model=UserStoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate an Agile User Story from a business requirement",
    description=(
        "Converts a plain business requirement into a structured Agile User Story "
        "with acceptance criteria, priority, and story points — powered by Gemini 2.5 Flash."
    ),
)
async def generate_user_story_endpoint(request: UserStoryRequest) -> UserStoryResponse:
    if not request.requirement.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="requirement cannot be empty.",
        )

    try:
        return await generate_user_story(request)
    except ValueError as exc:
        logger.warning("User story validation error: %s", exc)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    except RuntimeError as exc:
        logger.error("User story generation failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
