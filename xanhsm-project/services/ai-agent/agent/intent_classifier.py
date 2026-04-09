"""
Intent Classifier — phân loại câu hỏi của user trước khi route vào tool
"""
from enum import Enum

class Intent(str, Enum):
    MENU_QUERY       = "menu_query"        # Hỏi về món / nguyên liệu / allergen
    RECOMMENDATION   = "recommendation"    # Muốn gợi ý món
    OUT_OF_SCOPE     = "out_of_scope"      # Ngoài phạm vi menu

# TODO (Agent Team): implement classify(message: str) -> Intent
# Gợi ý: dùng LLM với few-shot examples, hoặc keyword matching đơn giản trước
def classify(message: str) -> Intent:
    raise NotImplementedError
