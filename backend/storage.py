import json
import os
from typing import List, Dict

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "reviews.json")


class ReviewStorage:
    def __init__(self):
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, "w") as f:
                json.dump([], f)

    def get_reviews(self) -> List[Dict]:
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def save_review(self, review: Dict):
        reviews = self.get_reviews()
        reviews.insert(0, review)
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(reviews, f, indent=2, ensure_ascii=False)

    def clear(self):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)
