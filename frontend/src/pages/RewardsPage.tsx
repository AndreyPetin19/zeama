import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gift, Lock, CheckCircle, PenLine, Star, Zap, TrendingUp } from 'lucide-react'
import Header from '../components/Header'
import { getCurrentUser } from '../utils/auth'

interface Reward {
  id: string
  points: number
  title: string
  description: string
  icon: React.ElementType
  color: string
  iconColor: string
}

const REWARDS: Reward[] = [
  {
    id: 'r1',
    points: 50,
    title: 'Small Discount',
    description: '5% off your next purchase at any partner store.',
    icon: Star,
    color: 'from-violet-400 to-zeama-500',
    iconColor: 'text-zeama-200',
  },
  {
    id: 'r2',
    points: 100,
    title: 'Free Delivery',
    description: 'Free shipping on your next order — no minimum spend.',
    icon: Zap,
    color: 'from-reward-400 to-amber-500',
    iconColor: 'text-amber-100',
  },
  {
    id: 'r3',
    points: 200,
    title: 'Premium Coupon',
    description: '15% off your next purchase. Valid for 30 days after redemption.',
    icon: Gift,
    color: 'from-emerald-400 to-teal-500',
    iconColor: 'text-emerald-100',
  },
  {
    id: 'r4',
    points: 350,
    title: 'VIP Access',
    description: 'Early access to new products and exclusive member offers.',
    icon: TrendingUp,
    color: 'from-rose-400 to-pink-500',
    iconColor: 'text-rose-100',
  },
]

const HOW_TO_EARN = [
  { label: 'Good Review (75–100%)',   pts: '+100 pts', color: 'text-emerald-600' },
  { label: 'Medium Review (40–74%)',  pts: '+70 pts',  color: 'text-amber-600' },
  { label: 'Poor Review (0–39%)',     pts: '+20 pts',  color: 'text-red-500' },
]

export default function RewardsPage() {
  const user = getCurrentUser()
  const points = user?.totalPoints ?? 0

  const nextReward = REWARDS.find(r => r.points > points)
  const ptsToNext = nextReward ? nextReward.points - points : 0
  const maxPts = REWARDS[REWARDS.length - 1].points

  return (
    <div className="min-h-dvh bg-zeama-50 pb-24 md:pb-8">
      <Header />

      <div className="max-w-2xl mx-auto px-4 pt-20">
        <div className="py-6">
          <h1 className="text-xl font-black text-zeama-900">Rewards</h1>
          <p className="text-sm text-slate-500 mt-0.5">Redeem your ZEAMA points for real benefits</p>
        </div>

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="card p-6 bg-gradient-to-br from-zeama-600 via-zeama-700 to-violet-700 text-white mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-zeama-200 text-xs font-semibold uppercase tracking-wide mb-1">Your balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">{points}</span>
                <span className="text-zeama-300">ZEAMA points</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8 text-reward-300" />
            </div>
          </div>

          {/* Progress to next reward */}
          {nextReward && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zeama-300">{ptsToNext} pts until <strong className="text-white">{nextReward.title}</strong></span>
                <span className="text-zeama-300">{nextReward.points} pts</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (points / nextReward.points) * 100)}%` }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
                  className="h-full bg-reward-400 rounded-full"
                />
              </div>
            </div>
          )}

          {!nextReward && (
            <div className="flex items-center gap-2 text-reward-300 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              You've unlocked all rewards!
            </div>
          )}
        </motion.div>

        {/* Reward cards */}
        <div className="space-y-3 mb-6">
          {REWARDS.map((reward, i) => {
            const unlocked = points >= reward.points
            const Icon = reward.icon
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className={`card overflow-hidden transition-all duration-200 ${
                  unlocked ? 'shadow-card-hover' : 'opacity-60'
                }`}
              >
                <div className="flex items-stretch">
                  {/* Color strip + icon */}
                  <div className={`w-20 bg-gradient-to-b ${reward.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-8 h-8 ${reward.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-sm text-zeama-900">{reward.title}</h3>
                        {unlocked && (
                          <span className="badge-good text-[10px]">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{reward.description}</p>
                      <p className="text-xs font-bold text-zeama-600 mt-1.5">{reward.points} points required</p>
                    </div>

                    {unlocked ? (
                      <button className="flex-shrink-0 btn-primary text-xs px-3 py-2">
                        Redeem
                      </button>
                    ) : (
                      <div className="flex-shrink-0 w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* How to earn more */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="card p-5 mb-6"
        >
          <h3 className="font-bold text-sm text-zeama-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-zeama-500" />
            How to earn more points
          </h3>
          <div className="space-y-2">
            {HOW_TO_EARN.map(({ label, pts, color }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-zeama-50 last:border-0">
                <span className="text-xs text-slate-600">{label}</span>
                <span className={`text-xs font-black ${color}`}>{pts}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            The more specific, helpful, and authentic your review is, the higher your AI score — and the more points you earn.
          </p>
        </motion.div>

        {/* CTA */}
        <div className="text-center pb-4">
          <Link to="/review" className="btn-primary text-sm px-7 py-3">
            <PenLine className="w-4 h-4" />
            Write a review to earn points
          </Link>
          <p className="text-xs text-slate-400 mt-2">
            Detailed reviews earn up to 100 points each
          </p>
        </div>
      </div>
    </div>
  )
}
