"""
In-memory state store for dashboard counters.
Replace with a database (Redis / PostgreSQL) for production multi-instance deployments.
"""
from dataclasses import dataclass, field


@dataclass
class AppState:
    total_meetings_processed: int = 0
    total_stories_generated: int = 0
    total_action_items: int = 0
    open_action_items: int = 0


state = AppState()
