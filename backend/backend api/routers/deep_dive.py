from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from models.schemas import StandardResponse

router = APIRouter()

class DeepDiveExploreRequest(BaseModel):
    task_id: str
    topic_id: str
    question: str

@router.get("/{task_id}/{topic_id}", response_model=StandardResponse[Dict[str, Any]], summary="Topic Deep Dive Breakdown", response_description="The extended paragraph/content and citations tied to a dashboard node.")
async def get_deep_dive(task_id: str, topic_id: str):
    """Fetch granular, in-depth research data on a specific sub-topic or citation."""
    data = {
        "task_id": task_id,
        "topic_id": topic_id,
        "title": f"Deep Dive Context for {topic_id}",
        "content": "This is detailed technical information.",
        "citations": ["[1] https://example.com/source3"]
    }
    return StandardResponse(success=True, data=data)

@router.post("/explore", response_model=StandardResponse[Dict[str, Any]], summary="Question specific Research Thread", response_description="Allows a follow up QA using context from a specific deep dive panel")
async def explore_followup(request: DeepDiveExploreRequest):
    """Ask follow-up questions on the researched material."""
    data = {
        "response": f"AI Answer for '{request.question}' on {request.topic_id} context."
    }
    return StandardResponse(success=True, data=data)
