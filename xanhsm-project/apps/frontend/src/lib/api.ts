// Wrapper gọi AI Agent API
import type { ChatRequest, ChatResponse } from "@xanhsm/shared";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "http://localhost:8000";

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${AGENT_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`Agent error: ${res.status}`);
  return res.json() as Promise<ChatResponse>;
}

export async function reportOutcome(log_id: string, outcome: "converted" | "reported_wrong" | "ignored") {
  await fetch(`${process.env.NEXT_PUBLIC_EVAL_URL ?? "http://localhost:8002"}/eval/outcome`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ log_id, outcome }),
  });
}

export async function reportCorrection(log_id: string, item_id: string, reason: string) {
  await fetch(`${process.env.NEXT_PUBLIC_EVAL_URL ?? "http://localhost:8002"}/eval/correction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ log_id, item_id, reason }),
  });
}
