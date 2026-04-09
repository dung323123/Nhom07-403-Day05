"""
Evaluation API routes
POST /eval/log        — nhận EvalLog từ AI Agent
POST /eval/outcome    — ghi conversion/ignored
POST /eval/correction — ghi báo sai → alert merchant
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from evaluation.logger import write_log, update_outcome, write_correction

router = APIRouter()

class EvalLogRequest(BaseModel):
    session_id: str
    user_id: str
    store_id: str
    query: str
    intent: str
    tools_called: list
    response_text: str
    confidence: str
    latency_ms: float

class OutcomeRequest(BaseModel):
    log_id: str
    outcome: str    # "converted" | "reported_wrong" | "ignored"

class CorrectionRequest(BaseModel):
    log_id: str
    item_id: str
    reason: str
    user_note: Optional[str] = None

@router.post("/eval/log")
async def log_eval(req: EvalLogRequest):
    log_id = write_log(req.model_dump())
    return {"log_id": log_id}

@router.post("/eval/outcome")
async def log_outcome(req: OutcomeRequest):
    update_outcome(req.log_id, req.outcome)
    return {"ok": True}

@router.post("/eval/correction")
async def log_correction(req: CorrectionRequest):
    write_correction(req.model_dump())
    # TODO: trigger merchant notification
    return {"ok": True}
