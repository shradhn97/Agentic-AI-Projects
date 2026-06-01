from pydantic import BaseModel


class JiraAnalysisResponse(BaseModel):
    totalTickets: int
    completed: int
    inProgress: int
    blocked: int
    riskSummary: str
