from pydantic import BaseModel
from typing import List


class UserStoryRequest(BaseModel):
    requirement: str


class UserStoryResponse(BaseModel):
    title: str
    userStory: str
    acceptanceCriteria: List[str]
    priority: str
    storyPoints: str
