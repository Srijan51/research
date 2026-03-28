from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import asyncio
from models.schemas import StandardResponse

router = APIRouter()

class AgentStatus(BaseModel):
    task_id: str
    status: str
    progress: int

@router.get("/{task_id}/status", response_model=StandardResponse[AgentStatus], summary="Get Agent Status", response_description="Poll the agent state while it evaluates data")
async def get_agent_status(task_id: str):
    """Poll the current status of the research agent."""
    data = AgentStatus(task_id=task_id, status="Gathering Sources", progress=35)
    return StandardResponse(success=True, data=data)

@router.post("/{task_id}/stop", response_model=StandardResponse[dict], summary="Stop Agent Task")
async def stop_agent(task_id: str):
    """Terminate a running agent process."""
    return StandardResponse(success=True, data={"message": f"Agent task {task_id} stopped."})

@router.websocket("/{task_id}/stream")
async def agent_status_stream(websocket: WebSocket, task_id: str):
    """WebSocket for real-time agent process updates."""
    await websocket.accept()
    try:
        steps = [
            {"step": 1, "message": "Initializing Research Agent..."},
            {"step": 2, "message": "Querying Web Sources..."},
            {"step": 3, "message": "Analyzing Content..."},
            {"step": 4, "message": "Synthesizing Draft..."}
        ]
        for step in steps:
            await asyncio.sleep(2) 
            await websocket.send_json({"task_id": task_id, **step})
            
        await websocket.send_json({"task_id": task_id, "status": "completed", "message": "Done"})
    except WebSocketDisconnect:
        pass
