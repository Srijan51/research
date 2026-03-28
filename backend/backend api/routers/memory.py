from fastapi import APIRouter
from typing import List, Dict, Any
from models.schemas import StandardResponse

router = APIRouter()

@router.get("/history", response_model=StandardResponse[List[Dict[str, Any]]], summary="Get Chat History", response_description="Loads previous tasks for the side bar")
async def get_history():
    """Retrieve a list of past research tasks."""
    data = [
        {"task_id": "uuid-111", "query": "Quantum", "date": "2023-11-01"},
        {"task_id": "uuid-222", "query": "Rust", "date": "2023-10-15"}
    ]
    return StandardResponse(success=True, data=data)

@router.get("/context/{task_id}", response_model=StandardResponse[dict], summary="Reload Past Context", response_description="Rehydrate memory states from old tasks")
async def get_context(task_id: str):
    """Load past context or saved insights."""
    data = {"task_id": task_id, "saved_context": "The model remembered your past style."}
    return StandardResponse(success=True, data=data)

@router.delete("/{task_id}", response_model=StandardResponse[dict], summary="Clear Workspace Memory", response_description="Force delete specific tasks and embeddings contexts")
async def delete_memory(task_id: str):
    """Delete a saved research record to manage history."""
    return StandardResponse(success=True, data={"message": "Deleted"})
