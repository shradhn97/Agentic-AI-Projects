import logging
from app.models.mom import MoMRequest, MoMResponse, ActionItem
from app.services.gemini_service import generate_structured_response
from app.prompts.mom_prompt import MOM_SYSTEM_PROMPT, get_mom_user_prompt
from app import state

logger = logging.getLogger(__name__)


async def generate_mom(request: MoMRequest) -> MoMResponse:
    """Generate structured MoM from raw meeting notes using Gemini."""

    user_prompt = get_mom_user_prompt(
        meeting_name=request.meetingName,
        meeting_date=request.meetingDate,
        meeting_notes=request.meetingNotes,
    )

    data = await generate_structured_response(
        system_prompt=MOM_SYSTEM_PROMPT,
        user_prompt=user_prompt,
    )

    action_items = [
        ActionItem(
            task=item.get("task", ""),
            owner=item.get("owner", "Team"),
            dueDate=item.get("dueDate", "TBD"),
        )
        for item in data.get("actionItems", [])
    ]

    response = MoMResponse(
        meetingName=data.get("meetingName", request.meetingName),
        meetingDate=data.get("meetingDate", request.meetingDate),
        attendees=data.get("attendees", []),
        discussionPoints=data.get("discussionPoints", []),
        actionItems=action_items,
        meetingSummary=data.get("meetingSummary", ""),
    )

    # Update dashboard counters
    state.state.total_meetings_processed += 1
    new_items = len(action_items)
    state.state.total_action_items += new_items
    state.state.open_action_items += new_items

    logger.info("MoM generated for meeting: %s", request.meetingName)
    return response
