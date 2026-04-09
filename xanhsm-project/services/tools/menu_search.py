"""
Tool: menu_search
Tìm kiếm món ăn theo query — tìm trong cả tên lẫn mô tả phụ (tránh miss như "Cơm bò lúc lắc")
Input:  query (str), store_id (str), data_path (str)
Output: List[MenuItem], confidence ("high"|"low"|"unsure")
"""
import json
from pathlib import Path

def menu_search(query: str, store_id: str, data_path: str = "/app/data") -> dict:
    # TODO (Tools Team): implement
    # 1. Load store JSON từ data_path/menus/{store_id}.json
    # 2. Tìm kiếm trong name + description + ingredients (không chỉ name)
    # 3. Trả về confidence dựa trên completeness của data
    raise NotImplementedError
