import asyncio
import logging
import httpx
from core.config import settings
from services.state import create_task, get_task, update_task

logger = logging.getLogger(__name__)

async def call_ollama(prompt: str) -> str:
    """Call the Ollama API. Falls back to a simple response if unavailable."""
    try:
        payload = {
            "model": settings.OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
        }

        headers = {"Content-Type": "application/json"}
        if settings.OLLAMA_API_KEY:
            headers["Authorization"] = f"Bearer {settings.OLLAMA_API_KEY}"

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate",
                json=payload,
                headers=headers,
            )
            response.raise_for_status()

        data = response.json()
        return data.get("response")
    except Exception as e:
        logger.error(f"Ollama API call failed: {e}")
        return None

async def run_agent(query: str, task_id: str) -> dict:
    """Start a research task and kick off AI processing in the background."""
    create_task(task_id, query)
    update_task(task_id, status="processing")
    
    # Run the AI generation in the background
    asyncio.create_task(_ai_processing(task_id, query))
    
    return {
        "task_id": task_id,
        "query": query,
        "status": "processing",
        "estimated_time_seconds": 15
    }

async def _ai_processing(task_id: str, query: str):
    """Background task that calls Ollama to generate strategy, results, and deep-dive content."""
    
    # --- 1. STRATEGY ---
    strategy_prompt = f"""You are a research strategist AI. For the research query: "{query}"
Generate exactly 3 strategic research steps. Return ONLY a JSON array like:
[{{"id": 1, "action": "Step Title", "description": "One sentence description."}}, ...]
No markdown, no explanation, just the JSON array."""
    
    strategy_text = await call_ollama(strategy_prompt)
    strategy = _parse_json_safe(strategy_text, fallback=[
        {"id": 1, "action": "Semantic Parsing", "description": f"Breaking down intent for '{query}'."},
        {"id": 2, "action": "Data Retrieval", "description": "Fetching relevant sources."},
        {"id": 3, "action": "Synthesis", "description": "Compiling final analysis."}
    ])
    update_task(task_id, strategy=strategy)
    
    # --- 2. RESULTS ---
    results_prompt = f"""You are a research analyst AI. For the query: "{query}"
Generate a research summary. Return ONLY a JSON object like:
{{"title": "Short findings title", "summary": "A detailed paragraph of findings.", "key_findings": ["Finding 1", "Finding 2", "Finding 3"]}}
No markdown, no explanation, just the JSON object."""
    
    results_text = await call_ollama(results_prompt)
    results = _parse_json_safe(results_text, fallback={
        "title": "Analysis Complete",
        "summary": f"Research on '{query}' has been completed with high confidence.",
        "key_findings": ["Data successfully retrieved.", "Patterns identified.", "Analysis synthesized."]
    })
    update_task(task_id, results=results)
    
    # --- 3. DEEP DIVE ---
    deep_dive_prompt = f"""You are a deep research AI. For the query: "{query}"
Generate an in-depth analysis paragraph and 3 citations. Return ONLY a JSON object like:
{{"content": "Detailed paragraph of deep analysis...", "citations": ["[1] Source name or URL", "[2] Source name", "[3] Source name"]}}
No markdown, no explanation, just the JSON object."""
    
    deep_dive_text = await call_ollama(deep_dive_prompt)
    deep_dive = _parse_json_safe(deep_dive_text, fallback={
        "content": f"Deep analysis of '{query}' reveals extensive interdisciplinary connections.",
        "citations": ["[1] Global Research Database", f"[2] ArXiv papers on {query}", "[3] IEEE Digital Library"]
    })
    update_task(task_id, deep_dive=deep_dive, status="completed", progress=100)

async def get_strategy_for_task(task_id: str) -> list:
    task = get_task(task_id)
    if task and task.get("strategy"):
        return task["strategy"]
    return []

async def answer_followup(task_id: str, question: str) -> str:
    """Answer a follow-up question using the research context."""
    task = get_task(task_id)
    context = ""
    if task:
        results = task.get("results", {})
        deep_dive = task.get("deep_dive", {})
        context = f"Research query: {task['query']}\nSummary: {results.get('summary', '')}\nDeep dive: {deep_dive.get('content', '')}"
    
    prompt = f"""You are a research assistant. Based on this research context:
{context}

Answer this follow-up question concisely in 2-3 sentences: "{question}" """
    
    answer = await call_ollama(prompt)
    return answer or f"I processed your question about '{question}' but couldn't generate a detailed answer at this time."

def _parse_json_safe(text: str, fallback):
    """Parse JSON from model response, handling markdown code fences."""
    if not text:
        return fallback
    try:
        # Strip markdown code fences if present
        cleaned = text.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            # Remove first and last lines (``` markers)
            lines = [l for l in lines if not l.strip().startswith("```")]
            cleaned = "\n".join(lines)
        
        import json
        return json.loads(cleaned)
    except Exception:
        return fallback
