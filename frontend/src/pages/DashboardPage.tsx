import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, PenLine, BarChart3, Gift, TrendingUp, Clock } from 'lucide-react'
import Header from '../components/Header'
import { getCurrentUser } from '../utils/auth'
import type { Review } from '../types'

// ── demo reviews always shown ─────────────────────────────────────────────────
const DEMO_REVIEWS: (Review & { userName: string; totalPoints: number })[] = [
  {
    id: 'demo-1',
    userName: 'Amina',
    reviewText: 'The hoodie is comfortable and the fabric feels soft, but after washing it once, the color became slightly lighter. The size was accurate and delivery was fast.',
    aiScore: 82,
    category: 'Good Review',
    pointsAwarded: 100,
    aiExplanation: 'This review is specific and useful. It includes real product experience, fit, delivery, material quality, and a clear issue after washing.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    totalPoints: 150,
  },
  {
    id: 'demo-2',
    userName: 'Daniyar',
    reviewText: 'Good product, I liked it.',
    aiScore: 28,
    category: 'Poor Review',
    pointsAwarded: 20,
    aiExplanation: 'This review is too short and generic. It does not include specific product details, personal experience, or useful information for other buyers.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    totalPoints: 20,
  },
]

function categoryBadge(cat: string) {
  if (cat === 'Good Review')   return 'badge-good'
  if (cat === 'Medium Review') return 'badge-medium'
  return 'badge-poor'
}

function scoreColor(score: number) {
  if (score >= 75) return 'text-emerald-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-red-500'
}

function ScoreCircle({ score }: { score: number }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <svg width="48" height="48" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="score-ring-circle" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-[11px] font-black ${scoreColor(score)}`}>{score}</span>
      </div>
    </div>
  )
}

function ReviewCard({ review, userName, totalPoints, index }: {
  review: Review
  userName: string
  totalPoints: number
  index: number
}) {
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="card p-4"
    >
      <div className="flex items-start gap-3">
        {/* Score circle */}
        <ScoreCircle score={review.aiScore} />

        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-sm text-zeama-900">{userName}</span>
            <span className={categoryBadge(review.category)}>{review.category}</span>
            <span className="ml-auto text-xs font-bold text-reward-500">+{review.pointsAwarded} pts</span>
          </div>

          {/* Review text */}
          <p className={`text-xs text-slate-600 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
            {review.reviewText}
          </p>
          {review.reviewText.length > 100 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-[11px] text-zeama-500 font-medium mt-1 hover:underline"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Gift className="w-3 h-3" />
              Total: <strong className="text-zeama-600">{totalPoints} pts</strong>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

type FilterKey = 'all' | 'good' | 'medium' | 'poor'

export default function DashboardPage() {
  const user = getCurrentUser()
  const [filter, setFilter] = useState<FilterKey>('all')

  // Merge user reviews + demo reviews into one feed
  const userReviews = (user?.reviews ?? []).map(r => ({
    ...r,
    userName: user!.name,
    totalPoints: user!.totalPoints,
  }))

  const allReviews = [...userReviews, ...DEMO_REVIEWS]

  const filtered = allReviews.filter(r => {
    if (filter === 'good')   return r.category === 'Good Review'
    if (filter === 'medium') return r.category === 'Medium Review'
    if (filter === 'poor')   return r.category === 'Poor Review'
    return true
  })

  const totalReviews = allReviews.length
  const avgScore = totalReviews > 0
    ? Math.round(allReviews.reduce((s, r) => s + r.aiScore, 0) / totalReviews)
    : 0
  const goodCount   = allReviews.filter(r => r.category === 'Good Review').length
  const totalPtsAll = (user?.totalPoints ?? 0) + DEMO_REVIEWS.reduce((s, r) => s + r.totalPoints, 0)

  const STATS = [
    { icon: BarChart3, label: 'Reviews',      value: totalReviews, color: 'text-zeama-600 bg-zeama-100' },
    { icon: TrendingUp, label: 'Avg. score',  value: `${avgScore}%`, color: 'text-violet-600 bg-violet-100' },
    { icon: Star,       label: 'Good reviews',value: goodCount,    color: 'text-emerald-600 bg-emerald-100' },
    { icon: Gift,       label: 'Total pts',   value: totalPtsAll,  color: 'text-reward-600 bg-reward-100' },
  ]

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all',    label: 'All' },
    { key: 'good',   label: 'Good' },
    { key: 'medium', label: 'Medium' },
    { key: 'poor',   label: 'Poor' },
  ]

  return (
    <div className="min-h-dvh bg-zeama-50 pb-24 md:pb-8">
      <Header />

      <div className="max-w-2xl mx-auto px-4 pt-20">
        <div className="py-6">
          <h1 className="text-xl font-black text-zeama-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Review activity and quality tracking</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {STATS.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="card p-4"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xl font-black text-zeama-900">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filter + list */}
        <div className="card overflow-hidden mb-6">
          {/* Filter bar */}
          <div className="p-3 border-b border-zeama-100 flex items-center gap-1.5 overflow-x-auto">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-150 active:scale-95 ${
                  filter === key
                    ? 'bg-zeama-600 text-white shadow-sm'
                    : 'bg-zeama-50 text-slate-600 hover:bg-zeama-100'
                }`}
              >
                {label}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-slate-400 flex-shrink-0">
              {filtered.length} review{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Reviews */}
          <div className="p-3 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-10">
                <BarChart3 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">No reviews here yet</p>
                <Link to="/review" className="btn-primary text-xs px-4 py-2 mt-3 inline-flex">
                  <PenLine className="w-3.5 h-3.5" />
                  Write first review
                </Link>
              </div>
            ) : (
              filtered.map((r, i) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  userName={r.userName}
                  totalPoints={r.totalPoints}
                  index={i}
                />
              ))
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-4">
          <Link to="/review" className="btn-primary text-sm px-6 py-3">
            <PenLine className="w-4 h-4" />
            Write a new review
          </Link>
        </div>
      </div>
    </div>
  )
}
