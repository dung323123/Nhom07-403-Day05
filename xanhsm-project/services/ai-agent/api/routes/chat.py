from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import time, os, httpx, threading, uuid, json, logging
from langchain_core.messages import HumanMessage
from agent.core import MerchantAgent, USER_MEMORIES
from tools import get_all_merchants
from tools.data_loader import DATA_PATH
from langgraph.checkpoint.memory import MemorySaver

router = APIRouter()

# Setup logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("api.chat")

# Global dict to hold one agent instance per merchant
agents = {}
# Single memory store for all sessions
memory = MemorySaver()

FEEDBACK_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "data", "mock", "merchant_feedback.json")
EVAL_LOGS_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "data", "mock", "merchant_eval_logs.json")

def send_eval_log(payload: dict):
    # Persist log locally for analytics dashboard
    try:
        os.makedirs(os.path.dirname(EVAL_LOGS_FILE), exist_ok=True)
        try:
            with open(EVAL_LOGS_FILE, "r", encoding="utf-8") as f:
                logs = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            logs = []
        logs.append(payload)
        with open(EVAL_LOGS_FILE, "w", encoding="utf-8") as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.error(f"Failed to persist eval log: {e}")

class ChatRequest(BaseModel):
    merchant_id: str
    message: str
    session_id: str = "default_session"
    user_id: str = "default_user"

class ActionButton(BaseModel):
    label: str
    action: str
    payload: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    log_id: str
    message: str
    merchant_name: str
    confidence: str = "high"
    action_buttons: Optional[List[ActionButton]] = None
    latency_ms: float
    total_tokens: int
    tool_debug_info: Optional[List[Dict[str, Any]]] = None

class FeedbackRequest(BaseModel):
    log_id: str
    merchant_id: str
    signal_type: str # 'positive', 'implicit_negative', 'explicit_negative'
    details: Optional[str] = None

class MenuUpdateRequest(BaseModel):
    item_id: str
    field: str # e.g., 'allergens'
    value: Any # e.g., ['đậu phộng', 'thịt bò']

@router.get("/merchants")
def list_merchants():
    """Return a list of all available merchants."""
    return get_all_merchants()

@router.get("/memory/{user_id}")
def get_user_memory(user_id: str):
    """Retrieve saved memory for a given user ID."""
    memories = USER_MEMORIES.get(user_id, [])
    return {"user_id": user_id, "memories": memories}

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """Chat with a specific merchant's AI assistant."""
    logger.info(f"Processing chat request for merchant: {request.merchant_id}, user: {request.user_id}")
    merchants = get_all_merchants()
    merchant = next((m for m in merchants if m["id"] == request.merchant_id), None)

    if not merchant:
        logger.warning(f"Merchant not found: {request.merchant_id}")
        raise HTTPException(status_code=404, detail="Merchant not found")

    # Instantiate the agent for this merchant if we haven't already
    if request.merchant_id not in agents:
        agents[request.merchant_id] = MerchantAgent(request.merchant_id, checkpointer=memory)

    agent = agents[request.merchant_id]

    # Run the agent graph
    config = {"configurable": {"thread_id": request.session_id, "user_id": request.user_id}}
    start_time = time.time()
    try:
        state = agent.invoke(
            {"messages": [HumanMessage(content=request.message)]},
            config=config
        )
    except Exception as e:
        logger.error(f"Error in agent execution for merchant {request.merchant_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
        
    latency_ms = (time.time() - start_time) * 1000

    messages = state["messages"]
    ai_response = messages[-1].content

    # Extract AI tracing info
    tools_called = []
    token_usage = {}
    for i, msg in enumerate(messages):
        if getattr(msg, "type", "") == "ai":
            if hasattr(msg, "tool_calls") and msg.tool_calls:
                for tc in msg.tool_calls:
                    # Find corresponding tool output in the next message (ToolMessage)
                    tool_output = "No output found"
                    if i + 1 < len(messages) and getattr(messages[i + 1], "type", "") == "tool":
                        tool_output = messages[i + 1].content
                    
                    tools_called.append({
                        "name": tc["name"], 
                        "args": tc["args"],
                        "output": tool_output
                    })
            if hasattr(msg, "response_metadata") and "token_usage" in msg.response_metadata:
                token_usage = msg.response_metadata["token_usage"]

    log_id = str(uuid.uuid4())

    # Fire-and-forget eval log (best effort)
    threading.Thread(target=send_eval_log, args=({
        "log_id": log_id,
        "merchant_id": request.merchant_id,
        "session_id": request.session_id,
        "user_id": request.user_id,
        "query": request.message,
        "response_text": ai_response,
        "tools_called": tools_called,
        "token_usage": token_usage,
        "latency_ms": latency_ms,
        "confidence": "high",
    },), daemon=True).start()

    # Determine dynamic action buttons
    action_buttons = [
        ActionButton(label="👍", action="like", payload={"query": request.message}),
        ActionButton(label="👎", action="dislike", payload={"query": request.message})
    ]

    logger.info(f"Chat response generated for {request.user_id} in {latency_ms:.2f}ms")
    return ChatResponse(
        log_id=log_id,
        message=ai_response,
        merchant_name=merchant["name"],
        confidence="high",
        action_buttons=action_buttons,
        latency_ms=round(latency_ms, 2),
        total_tokens=token_usage.get("total_tokens", 0),
        tool_debug_info=tools_called
    )

@router.get("/merchant/{merchant_id}/analytics")
def get_merchant_analytics(merchant_id: str):
    """Calculates metrics dynamically from real evaluation and feedback logs."""
    logger.info(f"Calculating analytics for merchant: {merchant_id}")
    # 1. Load Data
    try:
        with open(EVAL_LOGS_FILE, "r", encoding="utf-8") as f:
            eval_logs = [l for l in json.load(f) if l.get("merchant_id") == merchant_id]
    except (FileNotFoundError, json.JSONDecodeError):
        eval_logs = []

    try:
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            feedbacks = [f for f in json.load(f) if f.get("merchant_id") == merchant_id]
    except (FileNotFoundError, json.JSONDecodeError):
        feedbacks = []

    # 2. Calculate Metrics
    total_chats = len(eval_logs)
    if total_chats == 0:
        logger.info(f"No analytics data for merchant: {merchant_id}")
        return {"merchant_id": merchant_id, "total_chats": 0}

    total_latency = sum(l.get("latency_ms", 0) for l in eval_logs)
    total_tokens = sum(l.get("token_usage", {}).get("total_tokens", 0) for l in eval_logs)
    
    # Cost: $0.0000001 per token (est. for gpt-4o-mini)
    cost = total_tokens * 0.0000001 
    
    positive_feedback = len([f for f in feedbacks if f.get("signal_type") == "positive"])
    negative_feedback = len([f for f in feedbacks if f.get("signal_type") == "explicit_negative"])

    analytics = {
        "merchant_id": merchant_id,
        "avg_latency_ms": round(total_latency / total_chats, 2),
        "avg_cost_per_chat": round(cost / total_chats, 6),
        "conversion_rate": round(positive_feedback / total_chats, 2),
        "total_chats": total_chats,
        "satisfaction_score": round(positive_feedback / (positive_feedback + negative_feedback) if (positive_feedback + negative_feedback) > 0 else 0.0, 2)
    }
    logger.info(f"Analytics returned for merchant: {merchant_id}")
    return analytics

@router.post("/feedback")
def submit_feedback(request: FeedbackRequest):
    """Store explicit or implicit user feedback into the correction log."""
    logger.info(f"Receiving feedback: {request.signal_type} for log_id: {request.log_id}")
    try:
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            feedbacks = json.load(f)
    except FileNotFoundError:
        feedbacks = []
        
    feedbacks.append(request.model_dump() | {"timestamp": time.time()})
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(FEEDBACK_FILE), exist_ok=True)
    with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
        json.dump(feedbacks, f, ensure_ascii=False, indent=2)
        
    logger.info("Feedback successfully recorded.")
    return {"status": "success", "message": "Feedback recorded."}

@router.get("/merchant/{merchant_id}/feedback")
def get_merchant_feedback(merchant_id: str):
    """List all feedbacks for a merchant."""
    try:
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            feedbacks = json.load(f)
        return [f for f in feedbacks if f.get("merchant_id") == merchant_id]
    except FileNotFoundError:
        return []

@router.post("/merchant/{merchant_id}/menu/update")
def update_merchant_menu(merchant_id: str, request: MenuUpdateRequest):
    """Updates a specific menu item for a merchant to close the flywheel loop."""
    logger.info(f"Updating menu item {request.item_id} for merchant {merchant_id}")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    merchants = data if isinstance(data, list) else data.get("merchants", [])
    merchant = next((m for m in merchants if m["id"] == merchant_id), None)
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
        
    item = next((i for i in merchant.get("items", []) if i["id"] == request.item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    item[request.field] = request.value
    
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    logger.info(f"Menu item {request.item_id} updated successfully")
    return {"status": "success", "updated_item": item}
