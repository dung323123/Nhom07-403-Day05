"""
Tool: recommendation_filter
Gợi ý món theo điều kiện (giá, cay, category)
Input:  filters dict {"max_price": int, "spicy_level": int, "category": str}
        items: List[MenuItem]
Output: List[MenuItem] (top 3), needs_clarification (bool)
"""
def recommendation_filter(filters: dict, items: list) -> dict:
    # TODO (Tools Team): implement
    # Nếu filter quá chung (không đủ điều kiện lọc) → needs_clarification = True
    raise NotImplementedError
