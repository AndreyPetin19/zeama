# Review Booster — Hackathon MVP

> Businesses don't need more reviews. They need better ones.

Review Booster is a web app for businesses that automatically evaluates customer review quality using a mock AI scoring engine and rewards high-quality reviews with instant discount coupons.

---

## Quick Start

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on **http://localhost:8000**

API docs available at **http://localhost:8000/docs**

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page — premium SaaS-style marketing page |
| `/demo` | Interactive demo — try bad, average, and excellent reviews |
| `/review` | Customer review submission — mobile-first, QR-friendly |
| `/dashboard` | Business analytics — charts, table, filters |

---

## Testing the Demo

1. Start both the backend and frontend.
2. Navigate to **http://localhost:5173/demo**
3. Click **"Bad review"** → Score ~10–25, no coupon
4. Click **"Average review"** → Score ~45–60, 5–10% coupon
5. Click **"Excellent review"** → Score ~80–92, 15% coupon

You can also switch to "Try your own" mode and type a custom review.

---

## Reward Logic

| Score | Reward |
|-------|--------|
| 0–39 | No coupon |
| 40–59 | 5% off coupon |
| 60–79 | 10% off coupon |
| 80–100 | 15% off coupon |

---

## Mock AI Scoring Logic

**Location:** `backend/scoring.py`

The scoring engine evaluates:

1. **Word count** — Base score based on length (shorter = lower)
2. **Positive keywords** — "service", "quality", "atmosphere", "staff", etc.
3. **Specific keywords** — "coffee", "menu", "parking", "portions", etc.
4. **Constructiveness** — Improvement suggestions boost the score
5. **Spam detection** — Low word diversity or gibberish gets penalized
6. **Sentiment** — Inferred from rating + strong emotional keywords

### Where to plug in real AI

Replace the `score_review()` function in `backend/scoring.py` with a call to your real AI model:

```python
# backend/scoring.py — replace this function body with real AI call
def score_review(review_text: str, rating: int) -> dict:
    # TODO: Replace with real model inference
    # e.g., result = my_model.predict(review_text, rating)
    ...
```

The function signature and return shape are already defined — swap in any model that returns the same dict structure.

---

## API Endpoints

```
GET  /api/health          — Backend health check
POST /api/analyze-review  — Analyze a review and return score + coupon
GET  /api/reviews         — All submitted reviews
GET  /api/dashboard-stats — Aggregated analytics
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + custom design tokens |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| HTTP client | Axios |
| Backend | FastAPI (Python) |
| Storage | JSON file (data/reviews.json) |

---

## Project Structure

```
zeama/
├── backend/
│   ├── main.py          # FastAPI app + endpoints
│   ├── scoring.py       # Mock AI scoring engine ← plug real AI here
│   ├── storage.py       # JSON file persistence
│   ├── data/            # Auto-created on first run
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts          # Typed API client
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ScoreRing.tsx      # Animated SVG score ring
│   │   │   └── CouponCard.tsx     # Animated coupon with copy
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx    # Marketing page
│   │   │   ├── ReviewPage.tsx     # Customer flow (form → analyze → result)
│   │   │   ├── DashboardPage.tsx  # Business analytics
│   │   │   └── DemoPage.tsx       # Hackathon demo
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env
│   └── package.json
│
└── README.md
```
