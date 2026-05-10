import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sparkles, Gift, ArrowLeft, CheckCircle, XCircle,
  AlertTriangle, Lightbulb, Info, Star, TrendingUp,
} from 'lucide-react'
import Header from '../components/Header'
import { analyzeReview } from '../utils/scoring'
import { addReviewToCurrentUser, getCurrentUser } from '../utils/auth'
import type { ReviewAnalysis } from '../types'

type Stage = 'form' | 'analyzing' | 'result'

const ANALYZING_STEPS = [
  { label: 'Reading your review…',         pct: 20 },
  { label: 'Checking specificity…',        pct: 40 },
  { label: 'Analyzing helpfulness…',       pct: 60 },
  { label: 'Measuring authenticity…',      pct: 80 },
  { label: 'Computing your reward…',       pct: 95 },
]

function categoryColor(cat: string) {
  if (cat === 'Good Review')   return { ring: '#10b981', bg: 'bg-emerald-50',  text: 'text-emerald-700', badge: 'badge-good' }
  if (cat === 'Medium Review') return { ring: '#f59e0b', bg: 'bg-amber-50',   text: 'text-amber-700',   badge: 'badge-medium' }
  return                               { ring: '#ef4444', bg: 'bg-red-50',     text: 'text-red-600',     badge: 'badge-poor' }
}

function ScoreRing({ score, ring }: { score: number; ring: string }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg width="112" height="112" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="56" cy="56" r={r} fill="none" stroke="#e5e7eb" strokeWidth="9" />
        <circle
          cx="56" cy="56" r={r} fill="none"
          stroke={ring} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-ring-circle"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-zeama-900 leading-none">{score}</span>
        <span className="text-[11px] text-slate-400 font-medium">/ 100</span>
      </div>
    </div>
  )
}

function BreakdownBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  const color = pct >= 70 ? 'bg-emerald-400' : pct >= 45 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-zeama-900">{value}<span className="text-slate-400">/{max}</span></span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

function AnalyzingScreen() {
  const [step, setStep] = useState(0)
  const [pct, setPct]   = useState(ANALYZING_STEPS[0].pct)

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i = Math.min(i + 1, ANALYZING_STEPS.length - 1)
      setStep(i)
      setPct(ANALYZING_STEPS[i].pct)
    }, 480)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="card p-10 flex flex-col items-center gap-6">
      {/* Animated ring */}
      <div className="relative w-20 h-20">
        <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r="32" fill="none" stroke="#ede9fe" strokeWidth="7" />
          <circle
            cx="40" cy="40" r="32" fill="none"
            stroke="#7c3aed" strokeWidth="7"
            strokeDasharray="201"
            strokeDashoffset={201 - (201 * pct) / 100}
            strokeLinecap="round"
            className="score-ring-circle"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-zeama-500 animate-pulse-soft" />
        </div>
      </div>

      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="text-sm font-semibold text-zeama-900"
          >
            {ANALYZING_STEPS[step].label}
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-slate-400 mt-1">AI is evaluating your review</p>
      </div>

      <div className="flex gap-1.5">
        {ANALYZING_STEPS.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-400 ${i <= step ? 'bg-zeama-500 w-5' : 'bg-slate-200 w-2'}`} />
        ))}
      </div>
    </div>
  )
}

function ResultCard({ result, prevPoints, onReset }: {
  result: ReviewAnalysis
  prevPoints: number
  onReset: () => void
}) {
  const { ring, bg, badge } = categoryColor(result.category)
  const newTotal = prevPoints + result.pointsAwarded

  return (
    <div className="space-y-3">
      {/* Score + category */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className={`card p-6 text-center ${bg}`}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
          Your review quality score
        </p>
        <div className="flex justify-center mb-4">
          <ScoreRing score={result.score} ring={ring} />
        </div>
        <span className={badge}>{result.category}</span>
      </motion.div>

      {/* Points earned */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="card p-5 bg-gradient-to-r from-zeama-600 to-violet-600"
      >
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-zeama-200 text-xs font-semibold mb-1">Points earned</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">+{result.pointsAwarded}</span>
              <span className="text-zeama-300 text-sm">points</span>
            </div>
            <p className="text-zeama-300 text-xs mt-1">
              Total ZEAMA points: <strong className="text-reward-300">{newTotal}</strong>
            </p>
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
            <Gift className="w-7 h-7 text-reward-400" />
          </div>
        </div>
      </motion.div>

      {/* Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="card p-5 space-y-3"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Score breakdown</p>
        <BreakdownBar label="Specificity"           value={result.breakdown.specificity}          max={25} />
        <BreakdownBar label="Helpfulness"           value={result.breakdown.helpfulness}          max={25} />
        <BreakdownBar label="Authenticity"          value={result.breakdown.authenticity}         max={20} />
        <BreakdownBar label="Structure"             value={result.breakdown.structure}            max={15} />
        <BreakdownBar label="Constructive feedback" value={result.breakdown.constructiveFeedback} max={15} />

        {result.breakdown.penalty > 0 && (
          <div className="flex items-center gap-2 pt-1 text-xs text-red-500 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            Generic/spam penalty: −{result.breakdown.penalty} pts
            <span className="text-slate-400 font-normal">(authenticity score: {result.breakdown.humanAuthenticityScore}%)</span>
          </div>
        )}
      </motion.div>

      {/* AI explanation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="card p-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-zeama-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-zeama-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zeama-900 mb-1">AI Explanation</p>
            <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex gap-2"
      >
        <button onClick={onReset} className="btn-secondary flex-1 py-3 text-sm">
          Write another
        </button>
        <Link to="/rewards" className="btn-primary flex-1 py-3 text-sm justify-center">
          <Gift className="w-4 h-4" />
          View rewards
        </Link>
      </motion.div>
    </div>
  )
}

const GUIDANCE = [
  'What product did you buy?',
  'What did you like or dislike?',
  'How was the size, fit, or quality?',
  'Would you recommend it?',
]

export default function ReviewPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [text, setText]       = useState('')
  const [stage, setStage]     = useState<Stage>('form')
  const [result, setResult]   = useState<ReviewAnalysis | null>(null)
  const [prevPoints, setPrev] = useState(0)
  const [rating, setRating]   = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || wordCount < 2) return
    setPrev(user?.totalPoints ?? 0)
    setStage('analyzing')
    window.scrollTo({ top: 0, behavior: 'smooth' })

    await new Promise(r => setTimeout(r, 2800))

    const analysis = analyzeReview(text)
    addReviewToCurrentUser({
      id: crypto.randomUUID(),
      reviewText: text,
      aiScore: analysis.score,
      category: analysis.category,
      pointsAwarded: analysis.pointsAwarded,
      aiExplanation: analysis.explanation,
      createdAt: new Date().toISOString(),
      breakdown: analysis.breakdown,
    })
    setResult(analysis)
    setStage('result')
  }

  const handleReset = () => {
    setText('')
    setRating(0)
    setResult(null)
    setStage('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const displayStars = hoveredStar || rating

  return (
    <div className="min-h-dvh bg-zeama-50 pb-24 md:pb-8">
      <Header onPointsChange={result?.pointsAwarded} />

      <div className="max-w-lg mx-auto px-4 pt-20">
        {/* Back link */}
        <Link to="/home" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-zeama-700 transition-colors mt-4 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        <AnimatePresence mode="wait">
          {/* ── FORM ── */}
          {stage === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Guidance card */}
              <div className="card p-4 mb-4 bg-zeama-50 border-zeama-200">
                <p className="text-xs font-semibold text-zeama-700 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Write a helpful review — cover these points:
                </p>
                <ul className="space-y-1">
                  {GUIDANCE.map(g => (
                    <li key={g} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <div className="w-1 h-1 rounded-full bg-zeama-400" />
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-2.5 text-[11px] text-slate-400">
                  Short and generic reviews earn fewer points. Detailed and useful reviews earn more.
                </p>
              </div>

              <div className="card p-5">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Star rating */}
                  <div>
                    <label className="label">Overall rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n} type="button"
                          onClick={() => setRating(n)}
                          onMouseEnter={() => setHoveredStar(n)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform duration-100 hover:scale-110 active:scale-90"
                        >
                          <Star className={`w-8 h-8 transition-colors duration-100 ${
                            n <= displayStars ? 'text-reward-400 fill-reward-400' : 'text-slate-200 fill-slate-200'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label mb-0">Your review</label>
                      <span className={`text-xs font-medium transition-colors ${
                        wordCount >= 40 ? 'text-emerald-600' :
                        wordCount >= 20 ? 'text-amber-600' : 'text-slate-400'
                      }`}>
                        {wordCount} words
                        {wordCount >= 40 ? ' ✓' : wordCount >= 20 ? ' — keep going!' : ' — aim for 40+'}
                      </span>
                    </div>
                    <textarea
                      value={text}
                      onChange={e => setText(e.target.value)}
                      rows={6}
                      placeholder="E.g. I bought this hoodie in size M. The fabric is thick and warm, but after washing once the color faded slightly. The fit is oversized — I'd recommend sizing down. Delivery was fast and packaging was secure."
                      className="input resize-none leading-relaxed text-sm"
                    />
                    <p className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Reviews scoring 75%+ earn 100 pts · 40–74% earn 70 pts · below 40% earn 20 pts
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={wordCount < 2}
                    className="btn-primary w-full py-3.5 text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze Review
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── ANALYZING ── */}
          {stage === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <AnalyzingScreen />
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {stage === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <ResultCard result={result} prevPoints={prevPoints} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
