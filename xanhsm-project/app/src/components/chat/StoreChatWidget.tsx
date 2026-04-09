"use client";

/**
 * Floating chat widget — allows customers to ask the AI agent about a store's menu,
 * FAQs, allergens, etc. Connects to the backend POST /chat endpoint.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { sendChatMessage } from "@/lib/api";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface StoreChatWidgetProps {
  /** Backend merchant_id (M001, M002, M003) */
  merchantId: string;
  /** Store display name shown in the chat header */
  storeName: string;
}

export default function StoreChatWidget({
  merchantId,
  storeName,
}: StoreChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Unique session per widget instance
  const sessionIdRef = useRef(
    `session_${merchantId}_${Date.now()}`
  );

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage({
        merchant_id: merchantId,
        message: trimmed,
        session_id: sessionIdRef.current,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.response },
      ]);
    } catch (err) {
      // Show error in chat so user knows what happened
      const errorMsg =
        err instanceof Error ? err.message : "Lỗi kết nối. Thử lại sau.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `⚠️ ${errorMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, merchantId]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#00BCD4] text-white rounded-full shadow-lg hover:bg-[#0097A7] transition flex items-center justify-center"
        aria-label={isOpen ? "Đóng chat" : "Mở chat với quán"}
      >
        {isOpen ? (
          // Close icon
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Chat bubble icon
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ maxHeight: "70vh" }}
        >
          {/* Header */}
          <div className="bg-[#00BCD4] text-white px-4 py-3 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">Hỏi AI về {storeName}</p>
              <p className="text-[10px] opacity-80">Menu, dị ứng, giờ mở cửa…</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50" style={{ minHeight: 200 }}>
            {messages.length === 0 && (
              <p className="text-xs text-gray-400 text-center mt-8">
                Hỏi bất cứ điều gì về quán!<br />
                VD: &ldquo;Có món nào không chứa gluten?&rdquo;
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#00BCD4] text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-400 rounded-bl-sm shadow-sm">
                  Đang trả lời…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi…"
              className="flex-1 text-sm border border-gray-200 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-[#00BCD4] text-white rounded-full flex items-center justify-center hover:bg-[#0097A7] transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              aria-label="Gửi"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.27 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
