from fastapi import APIRouter
from pydantic import BaseModel
import uuid
from models.schemas import StandardResponse
from services import research

router = APIRouter()

class HeroStartRequest(BaseModel):
    query: str

class HeroStatusResponse(BaseModel):
    status: str
    message: str
    active_agents: int

@router.get("/status", response_model=StandardResponse[HeroStatusResponse], summary="Hero Status", response_description="Returns the current readiness state of the AI platform")
async def get_hero_status():
    """Check backend status to display in the hero section."""
    data = HeroStatusResponse(
        status="online",
        message="Auto Research System Ready.",
        active_agents=0
    )
    return StandardResponse(success=True, data=data)

@router.post("/start-research", response_model=StandardResponse[dict], summary="Start Research", response_description="Triggers the AI agent to begin researching the provided query")
async def start_research(request: HeroStartRequest):
    """Endpoint to initiate a new research topic from the hero input."""
    task_id = str(uuid.uuid4())
    # Offload the heavy AI logic to the service layer
    result_data = await research.run_agent(request.query, task_id)
    return StandardResponse(success=True, data=result_data, error=None)
