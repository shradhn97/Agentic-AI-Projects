from pydantic import BaseModel
from typing import List


class ActionItem(BaseModel):
    task: str
    owner: str
    dueDate: str


class MoMRequest(BaseModel):
    meetingName: str
    meetingDate: str
    meetingNotes: str


class MoMResponse(BaseModel):
    meetingName: str
    meetingDate: str
    attendees: List[str]
    discussionPoints: List[str]
    actionItems: List[ActionItem]
    meetingSummary: str
