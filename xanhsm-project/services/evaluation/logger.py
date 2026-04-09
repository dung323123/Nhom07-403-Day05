"""
EvalLogger — nhận EvalLog từ AI Agent và persist xuống file/DB
"""
import json
import uuid
from datetime import datetime
from pathlib import Path

LOG_DIR = Path("/app/logs")
LOG_DIR.mkdir(exist_ok=True)

def write_log(log: dict) -> str:
    log_id = log.get("log_id") or str(uuid.uuid4())
    log["log_id"] = log_id
    log["timestamp"] = log.get("timestamp") or datetime.utcnow().isoformat()

    log_file = LOG_DIR / f"{datetime.utcnow().strftime('%Y-%m-%d')}.jsonl"
    with open(log_file, "a") as f:
        f.write(json.dumps(log, ensure_ascii=False) + "\n")
    return log_id

def update_outcome(log_id: str, outcome: str):
    # TODO (Eval Team): update outcome field trong log
    pass

def write_correction(correction: dict):
    # TODO (Eval Team): ghi correction log + trigger merchant alert
    pass
