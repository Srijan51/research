from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
import uuid
from models.schemas import StandardResponse

router = APIRouter()

class OutputRequest(BaseModel):
    task_id: str
    format: str

@router.post("/generate", response_model=StandardResponse[dict], summary="Trigger Output Pipeline", response_description="Kick off the background task compiling PDFs/docs of research")
async def generate_output(request: OutputRequest, background_tasks: BackgroundTasks):
    """Generate a downloadable report based on the research results."""
    # Partner will place file generation scripts here
    file_id = str(uuid.uuid4())
    data = {
        "status": "Generating report...",
        "file_id": file_id,
        "format": request.format
    }
    return StandardResponse(success=True, data=data)

@router.get("/download/{file_id}", response_model=StandardResponse[dict], summary="Download compiled docs", response_description="Retrieve URL to fetch the compiled file object")
async def download_report(file_id: str):
    """Download the generated asset."""
    # Often returns FileResponse. Using mock URL for now.
    data = {
        "file_id": file_id,
        "download_url": f"https://example.com/assets/{file_id}.pdf"
    }
    return StandardResponse(success=True, data=data)
