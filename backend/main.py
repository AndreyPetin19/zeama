import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

from scoring import score_review
from storage import ReviewStorage

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"])

storage = ReviewStorage()


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "version": "1.0.0"})


@app.post("/api/analyze-review")
def analyze_review():
    data = request.get_json(force=True)
    customer_name = str(data.get("customer_name", "")).strip()
    contact = str(data.get("contact", "")).strip()
    rating = int(data.get("rating", 3))
    review_text = str(data.get("review_text", "")).strip()

    if not review_text:
        return jsonify({"error": "review_text is required"}), 400

    result = score_review(review_text, rating)

    review = {
        "id": str(uuid.uuid4()),
        "customer_name": customer_name,
        "contact": contact,
        "rating": rating,
        "review_text": review_text,
        **result,
        "created_at": datetime.now().isoformat(),
    }

    storage.save_review(review)
    return jsonify(review)


@app.get("/api/reviews")
def get_reviews():
    return jsonify(storage.get_reviews())


@app.get("/api/dashboard-stats")
def get_dashboard_stats():
    reviews = storage.get_reviews()

    if not reviews:
        return jsonify({
            "total_reviews": 0,
            "average_score": 0,
            "coupons_issued": 0,
            "spam_blocked": 0,
            "average_rating": 0,
            "estimated_repeat_visits": 0,
            "sentiment_breakdown": {"positive": 0, "neutral": 0, "negative": 0, "mixed": 0},
            "reward_breakdown": {"excellent": 0, "good": 0, "fair": 0, "poor": 0},
        })

    total = len(reviews)
    avg_score = sum(r["quality_score"] for r in reviews) / total
    coupons = sum(1 for r in reviews if r.get("coupon_code"))
    spam = sum(1 for r in reviews if r.get("spam_risk") == "high")
    avg_rating = sum(r["rating"] for r in reviews) / total

    sentiment_breakdown: dict = {"positive": 0, "neutral": 0, "negative": 0, "mixed": 0}
    reward_breakdown: dict = {"excellent": 0, "good": 0, "fair": 0, "poor": 0}

    for r in reviews:
        s = r.get("sentiment", "neutral")
        sentiment_breakdown[s] = sentiment_breakdown.get(s, 0) + 1
        rl = r.get("reward_level", "poor")
        reward_breakdown[rl] = reward_breakdown.get(rl, 0) + 1

    return jsonify({
        "total_reviews": total,
        "average_score": round(avg_score, 1),
        "coupons_issued": coupons,
        "spam_blocked": spam,
        "average_rating": round(avg_rating, 1),
        "estimated_repeat_visits": round(coupons * 0.73),
        "sentiment_breakdown": sentiment_breakdown,
        "reward_breakdown": reward_breakdown,
    })


if __name__ == "__main__":
    app.run(port=8000, debug=True)
