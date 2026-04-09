"""
AI Agent Core — LangGraph graph definition
"""
# TODO (Agent Team): implement LangGraph agent
# Flow: classify intent → route tool → build response → add disclaimer if needed
# Input:  ChatRequest (từ shared types)
# Output: ChatResponse (từ shared types)

# Gợi ý graph nodes:
# 1. classify_intent
# 2. route_to_tool (menu_search | recommendation | faq)
# 3. check_confidence
# 4. build_response (+ disclaimer nếu allergen)
# 5. log_to_eval
