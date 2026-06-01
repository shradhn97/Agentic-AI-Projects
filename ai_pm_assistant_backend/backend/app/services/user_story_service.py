import logging
from app.models.user_story import UserStoryRequest, UserStoryResponse
from app.services.gemini_service import generate_structured_response
from app.prompts.user_story_prompt import USER_STORY_SYSTEM_PROMPT, get_user_story_user_prompt
from app import state

logger = logging.getLogger(__name__)


async def generate_user_story(request: UserStoryRequest) -> UserStoryResponse:
    """Generate Agile User Story from a business requirement using Gemini."""

    user_prompt = get_user_story_user_prompt(requirement=request.requirement)

    data = await generate_structured_response(
        system_prompt=USER_STORY_SYSTEM_PROMPT,
        user_prompt=user_prompt,
    )

    response = UserStoryResponse(
        title=data.get("title", ""),
        userStory=data.get("userStory", ""),
        acceptanceCriteria=data.get("acceptanceCriteria", []),
        priority=data.get("priority", "Medium"),
        storyPoints=str(data.get("storyPoints", "3")),
    )

    # Update dashboard counter
    state.state.total_stories_generated += 1

    logger.info("User story generated: %s", response.title)
    return response
