from fastapi import APIRouter
from typing import Dict, Any, List
from models.schemas import StandardResponse

router = APIRouter()

@router.get("/{task_id}", response_model=StandardResponse[Dict[str, Any]], summary="Get Task Results", response_description="Fetch summary and key findings mapped to dashboard formats")
async def get_results(task_id: str):
    """Fetch high-level summary and key findings of a research task."""
    data = {
        "task_id": task_id,
        "title": "Impact of AI on Modern Web Development",
        "summary": "AI has significantly shifted how developers write code.",
        "key_findings": [
            "Developers use AI mainly for boilerplate code.",
            "Debugging is faster."
        ]
    }
    return StandardResponse(success=True, data=data)

@router.get("/{task_id}/metrics", response_model=StandardResponse[Dict[str, Any]], summary="Get Task Metrics", response_description="Fetch numeric stat cards for dashboard graphs")
async def get_metrics(task_id: str):
    """Fetch quantitative metrics."""
    data = {
        "sources_analyzed": 14,
        "time_taken_seconds": 12.4,
        "confidence_score": 0.92
    }
    return StandardResponse(success=True, data=data)
