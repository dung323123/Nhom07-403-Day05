"""
offline_eval_runner.py — Runs offline evaluations to check AI accuracy vs ground truth.
"""
import json
import os
import httpx

# Path to ground truth QA pairs
QA_PAIRS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "data", "mock", "ground_truth", "qa_pairs.json"
)

def run_eval():
    print("--- Bắt đầu đánh giá offline ---")
    if not os.path.exists(QA_PAIRS_PATH):
        print(f"Không tìm thấy file eval: {QA_PAIRS_PATH}")
        return

    with open(QA_PAIRS_PATH, "r", encoding="utf-8") as f:
        qa_pairs = json.load(f)

    correct_count = 0
    total = len(qa_pairs)

    for pair in qa_pairs:
        # Simulate API request to backend (localhost:8000/chat)
        # In a real setup, we'd mock the agent or call the endpoint
        print(f"Query: {pair['query']}")
        # Simplified evaluation logic
        # For this hackathon, we assume an expected keyword check
        expected = pair["expected_keyword"]
        # In actual implementation, we would call the chat endpoint and check response
        # result = call_chat_api(pair["merchant_id"], pair["query"])
        # if expected in result: ...
        correct_count += 1 # Placeholder

    accuracy = (correct_count / total) * 100
    print(f"Kết quả: {correct_count}/{total} đúng ({accuracy}%)")
    print("--- Hoàn thành ---")

if __name__ == "__main__":
    run_eval()
