from fastapi import APIRouter, status
from pydantic import BaseModel
from app import state

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])


class DashboardSummaryResponse(BaseModel):
    totalMeetingsProcessed: int
    totalStoriesGenerated: int
    totalActionItems: int
    openActionItems: int


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard summary counters",
    description=(
        "Returns aggregated counters for meetings processed, user stories generated, "
        "and action items tracked during the current server session."
    ),
)
async def get_dashboard_summary() -> DashboardSummaryResponse:
    s = state.state
    return DashboardSummaryResponse(
        totalMeetingsProcessed=s.total_meetings_processed,
        totalStoriesGenerated=s.total_stories_generated,
        totalActionItems=s.total_action_items,
        openActionItems=s.open_action_items,
    )
