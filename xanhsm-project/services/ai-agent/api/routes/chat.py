"""
POST /api/chat
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

# Mirror của shared/types/chat.ts — giữ đồng bộ
class ChatRequest(BaseModel):
    session_id: str
    user_id: str
    message: str
    store_id: str

class ChatResponse(BaseModel):
    log_id: str
    message: str
    confidence: str          # "high" | "low" | "unsure"
    disclaimer: Optional[str] = None
    cards: Optional[List[dict]] = None
    action_buttons: Optional[List[dict]] = None

@router.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # TODO (Agent Team): gọi agent/core.py
    raise NotImplementedError
