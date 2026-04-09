"""
Accuracy metric — so câu trả lời AI với ground truth từ merchant
Threshold: >= 92%  |  Red flag: < 80% trong 3 ngày liên tiếp
"""
def compute_accuracy(logs_path: str, ground_truth_path: str) -> float:
    # TODO (Eval Team): implement
    # Load logs + ground_truth/qa_pairs.json
    # So sánh response với expected_answer
    raise NotImplementedError
