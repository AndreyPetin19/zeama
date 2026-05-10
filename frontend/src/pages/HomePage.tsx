import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PenLine, Star, Sparkles, Gift, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react'
import Header from '../components/Header'
import { getCurrentUser } from '../utils/auth'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] },
  }),
}

const HOW_IT_WORKS = [
  {
    num: '01', icon: PenLine, color: 'bg-zeama-600',
    title: 'Write a review',
    desc: 'Share your honest product experience — what you liked, disliked, and whether you would recommend it.',
  },
  {
    num: '02', icon: Sparkles, color: 'bg-violet-500',
    title: 'AI scores it',
    desc: 'Our AI analyzes specificity, helpfulness, authenticity, and constructiveness in seconds.',
  },
  {
    num: '03', icon: Gift, color: 'bg-reward-500',
    title: 'Earn points',
    desc: 'Detailed reviews earn up to 100 points. Redeem them for discounts and exclusive rewards.',
  },
]

const SCORE_TIERS = [
  { range: '75–100%', label: 'Good Review',   points: '100 pts', color: 'text-emerald-600 bg-emerald-50  border-emerald-200' },
  { range: '40–74%',  label: 'Medium Review', points: '70 pts',  color: 'text-amber-600  bg-amber-50   border-amber-200' },
  { range: '0–39%',   label: 'Poor Review',   points: '20 pts',  color: 'text-red-500    bg-red-50     border-red-200' },
]

export default function HomePage() {
  const user = getCurrentUser()

  return (
    <div className="min-h-dvh bg-zeama-50 pb-20 md:pb-0">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-20">

        {/* Hero */}
        <section className="py-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center gap-2 bg-zeama-100 text-zeama-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-powered review rewards
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-3xl sm:text-4xl font-black text-zeama-900 leading-tight text-balance"
          >
            Write better reviews.<br />
            <span className="text-zeama-600">Earn more points.</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="mt-4 text-slate-600 text-base max-w-md mx-auto leading-relaxed"
          >
            Useful feedback deserves rewards. The more detailed and helpful your review,
            the more ZEAMA points you earn.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/review" className="btn-primary px-7 py-3 text-sm w-full sm:w-auto">
              <PenLine className="w-4 h-4" />
              Write a Review
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dashboard" className="btn-secondary px-7 py-3 text-sm w-full sm:w-auto">
              <TrendingUp className="w-4 h-4" />
              View Dashboard
            </Link>
          </motion.div>
        </section>

        {/* Points balance card (if user has points) */}
        {(user?.totalPoints ?? 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="card p-5 mb-6 bg-gradient-to-r from-zeama-600 to-violet-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zeama-200 text-xs font-semibold uppercase tracking-wide mb-1">Your ZEAMA balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{user!.totalPoints}</span>
                  <span className="text-zeama-200 text-sm">points</span>
                </div>
                <p className="text-zeama-300 text-xs mt-1">from {user!.reviews.length} review{user!.reviews.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-reward-400" />
              </div>
            </div>
            <Link to="/rewards" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-reward-300 hover:text-reward-200 transition-colors">
              View rewards <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}

        {/* How it works */}
        <section className="py-4">
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4"
          >
            How it works
          </motion.p>
          <div className="space-y-3">
            {HOW_IT_WORKS.map(({ num, icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={num}
                variants={fadeUp} initial="hidden" animate="show" custom={5 + i}
                className="card-hover p-5 flex gap-4"
              >
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-300">{num}</span>
                    <h3 className="font-bold text-zeama-900 text-sm">{title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Score tiers */}
        <section className="py-6">
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={8}
            className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4"
          >
            Reward tiers
          </motion.p>
          <div className="grid grid-cols-3 gap-2">
            {SCORE_TIERS.map(({ range, label, points, color }, i) => (
              <motion.div
                key={label}
                variants={fadeUp} initial="hidden" animate="show" custom={9 + i}
                className={`card p-3 text-center border ${color}`}
              >
                <div className="font-black text-lg leading-none">{points}</div>
                <div className="text-[10px] font-semibold mt-1">{label}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{range}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tip */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={12}
          className="card p-4 mb-8 border-l-4 border-zeama-400 bg-zeama-50"
        >
          <div className="flex items-start gap-3">
            <Star className="w-4 h-4 text-zeama-500 flex-shrink-0 mt-0.5" fill="currentColor" />
            <div>
              <p className="text-sm font-semibold text-zeama-900">Detailed reviews help businesses and buyers.</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Write about the product material, fit, delivery, and whether you'd recommend it.
                Short and generic reviews earn fewer points.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={13}
          className="text-center pb-8"
        >
          <Link to="/review" className="btn-primary px-8 py-3.5 text-sm">
            <PenLine className="w-4 h-4" />
            Write a Review now
          </Link>
          <p className="text-xs text-slate-400 mt-3">
            <CheckCircle className="w-3 h-3 inline mr-1 text-emerald-500" />
            Results in seconds · Points added instantly
          </p>
        </motion.div>
      </main>
    </div>
  )
}
