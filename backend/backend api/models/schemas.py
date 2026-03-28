from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, TypeVar, Generic
from datetime import datetime

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool = Field(True, description="Indicates if the request was successful")
    data: Optional[T] = Field(None, description="The returned data payload")
    error: Optional[str] = Field(None, description="Error message if success is false")

class ResearchRequest(BaseModel):
    query: str = Field(..., description="The main topic or question to research")
    depth: str = Field(default="standard", description="standard or deep")

class TaskResponse(BaseModel):
    task_id: str
    status: str = Field(..., description="pending, running, completed, error")
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AgentMetrics(BaseModel):
    task_id: str
    sources_analyzed: int
    time_taken_seconds: float
    confidence_score: float

class DeepDiveRequest(BaseModel):
    topic_id: str
    question: str

class ReportGenerationRequest(BaseModel):
    task_id: str
    format: str = Field(default="markdown", description="markdown, pdf, docx")

class MemoryHistoryResponse(BaseModel):
    history: List[Dict[str, Any]]
