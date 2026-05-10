import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Gift, LogOut, Star, PenLine, LayoutDashboard, Home, Trophy } from 'lucide-react'
import { getCurrentUser, logout } from '../utils/auth'

const NAV = [
  { to: '/home',      label: 'Home',          icon: Home },
  { to: '/review',    label: 'Write Review',  icon: PenLine },
  { to: '/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/rewards',   label: 'Rewards',       icon: Trophy },
]

export default function Header({ onPointsChange }: { onPointsChange?: number }) {
  const user = getCurrentUser()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // re-read points from localStorage on each render (onPointsChange triggers re-render)
  const currentUser = getCurrentUser()
  const points = currentUser?.totalPoints ?? 0

  if (!user) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zeama-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zeama-600 rounded-lg flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-white" fill="currentColor" />
            </div>
            <span className="font-black text-zeama-900 tracking-tight">ZEAMA</span>
          </Link>
          <div className="flex gap-2">
            <Link to="/login"  className="btn-ghost text-xs">Log in</Link>
            <Link to="/signup" className="btn-primary text-xs px-4 py-2">Sign up</Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zeama-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Left: greeting */}
        <div className="flex items-center gap-4 min-w-0">
          <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-zeama-600 rounded-lg flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-white" fill="currentColor" />
            </div>
          </Link>
          <span className="font-semibold text-zeama-900 text-sm truncate">
            Привет, <span className="text-zeama-600">{user.name}!</span>
          </span>
        </div>

        {/* Center: nav (hidden on small screens) */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                ${pathname === to
                  ? 'bg-zeama-100 text-zeama-700'
                  : 'text-slate-500 hover:text-zeama-700 hover:bg-zeama-50'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: points pill + logout */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/rewards" className="points-pill">
            <Gift className="w-4 h-4" />
            <span>{points.toLocaleString()}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 active:scale-95"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zeama-100 flex z-50">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors duration-150
              ${pathname === to ? 'text-zeama-600' : 'text-slate-400'}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
