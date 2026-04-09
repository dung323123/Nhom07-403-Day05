/**
 * API service layer for communicating with the ai-agent backend.
 * Uses the NEXT_PUBLIC_AGENT_URL env var (set in docker-compose or .env.local).
 */

// Default to localhost:8000 for local dev; docker-compose sets http://ai-agent:8000
const AGENT_BASE_URL =
  process.env.NEXT_PUBLIC_AGENT_URL ?? "http://localhost:8000";

/** Request body matching the backend's ChatRequest Pydantic model */
export interface ChatRequest {
  merchant_id: string;
  message: string;
  session_id?: string;
}

/** Response body matching the backend's ChatResponse Pydantic model */
export interface ChatResponse {
  response: string;
  merchant_name: string;
}

/**
 * Send a chat message to the AI agent for a specific merchant.
 * The backend returns a plain-text AI response and the merchant name.
 */
export async function sendChatMessage(
  req: ChatRequest
): Promise<ChatResponse> {
  const res = await fetch(`${AGENT_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: req.merchant_id,
      message: req.message,
      session_id: req.session_id ?? "default_session",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Chat API error ${res.status}: ${text}`);
  }

  return res.json();
}
