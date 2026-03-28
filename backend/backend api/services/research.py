import uuid
import asyncio

async def run_agent(query: str, task_id: str) -> dict:
    """
    Simulate running an agent or LLM chain.
    Your partner will replace this logic with LangChain/OpenAI calls.
    """
    # Partner code goes here:
    # llm = ChatOpenAI()
    # result = llm.predict(query)

    await asyncio.sleep(1) # Fake delay
    return {
        "task_id": task_id,
        "query": query,
        "status": "processing",
        "estimated_time_seconds": 45
    }

async def get_strategy_for_task(task_id: str) -> list:
    """
    Retrieve steps for a research task.
    Your partner will modify this to return dynamic steps based on the AI planner.
    """
    return [
        {"id": 1, "action": "Define the Scope", "description": "Identify boundaries."},
        {"id": 2, "action": "Information Retrieval", "description": "Fetch sources."}
    ]

# Other service functions can be added here
