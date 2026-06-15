import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3, BookOpen, Clock, Target, TrendingUp,
  List, Link2, Layers, GitBranch, Network,
  Hash, ArrowUpDown, Trophy, Zap, Star,
  ChevronRight, LogIn
} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import { arrayOperation } from '../api/dsa'
import axios from 'axios'
import toast from 'react-hot-toast'

const DSA_TOPICS = [
  { title: 'Arrays',       path: '/array',       icon: List,       color: 'from-blue-500 to-cyan-500',     bg: 'bg-blue-50 dark:bg-blue-900/20',     iconColor: 'text-blue-500'   },
  { title: 'Linked Lists', path: '/linked-list', icon: Link2,      color: 'from-purple-500 to-pink-500',   bg: 'bg-purple-50 dark:bg-purple-900/20', iconColor: 'text-purple-500' },
  { title: 'Stacks',       path: '/stack',       icon: Layers,     color: 'from-orange-500 to-red-500',    bg: 'bg-orange-50 dark:bg-orange-900/20', iconColor: 'text-orange-500' },
  { title: 'Queues',       path: '/queue',       icon: GitBranch,  color: 'from-green-500 to-teal-500',    bg: 'bg-green-50 dark:bg-green-900/20',   iconColor: 'text-green-500'  },
  { title: 'Trees',        path: '/tree',        icon: GitBranch,  color: 'from-pink-500 to-rose-500',     bg: 'bg-pink-50 dark:bg-pink-900/20',     iconColor: 'text-pink-500'   },
  { title: 'Graphs',       path: '/graph',       icon: Network,    color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', iconColor: 'text-indigo-500' },
  { title: 'Hash Tables',  path: '/hash-table',  icon: Hash,       color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', iconColor: 'text-yellow-500' },
  { title: 'Sorting',      path: '/sorting',     icon: ArrowUpDown,color: 'from-teal-500 to-green-500',    bg: 'bg-teal-50 dark:bg-teal-900/20',     iconColor: 'text-teal-500'   },
]

const QUICK_STATS = [
  { label: 'Topics Available', value: '8+',   icon: BookOpen,   color: 'text-sky-500',    bg: 'bg-sky-50 dark:bg-sky-900/20'       },
  { label: 'Algorithms',       value: '50+',  icon: Zap,        color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { label: 'View Modes',       value: '4',    icon: BarChart3,  color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20'   },
  { label: 'AI Assistant',     value: '24/7', icon: Star,       color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
]

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

// ── Logged In Dashboard ───────────────────────
function LoggedInDashboard({ user }) {
  const [stats,    setStats]    = useState(null)
  const [progress, setProgress] = useState([])
  const [bookmarks,setBookmarks]= useState([])
  const [loading,  setLoading]  = useState(true)
  const { accessToken } = useAuthStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${accessToken}` }
        const base    = 'http://127.0.0.1:8000/api'

        const [statsRes, progressRes, bookmarksRes] = await Promise.all([
          axios.get(`${base}/progress/stats/`,     { headers }),
          axios.get(`${base}/progress/`,           { headers }),
          axios.get(`${base}/bookmarks/`,          { headers }),
        ])

        setStats(statsRes.data)
        setProgress(progressRes.data.slice(0, 5))
        setBookmarks(bookmarksRes.data.slice(0, 4))
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [accessToken])

  const completedTopics  = stats?.summary?.completed_topics  || 0
  const totalTopics      = stats?.summary?.total_topics      || 0
  const completionPct    = stats?.summary?.completion_percentage || 0
  const totalViz         = stats?.stats?.total_visualizations || 0
  const streakDays       = stats?.stats?.streak_days          || 0
  const timeSpent        = stats?.stats?.total_time_minutes   || 0

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0  }}
        className="bg-gradient-to-r from-sky-500 to-purple-600 rounded-3xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black mb-1">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-white/70 text-sm">
              Continue your DSA mastery journey
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-black">{streakDays}</p>
              <p className="text-white/70 text-xs">Day Streak 🔥</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-black">{totalViz}</p>
              <p className="text-white/70 text-xs">Visualizations</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-black">{timeSpent}m</p>
              <p className="text-white/70 text-xs">Time Spent</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>Overall Progress</span>
            <span>{completedTopics}/{totalTopics} topics ({completionPct}%)</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Recent Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-sky-500" />
                Recent Activity
              </h2>
              <Link to="/array" className="text-xs text-sky-500 hover:underline">
                Start learning →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : progress.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-2">🚀</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  No activity yet!
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Start visualizing to track your progress
                </p>
                <Link
                  to="/array"
                  className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-sky-500 hover:underline"
                >
                  Start with Arrays <ChevronRight size={12} />
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {progress.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{p.topic}</p>
                      <p className="text-xs text-gray-400">{p.category}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      p.status === 'completed'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : p.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* DSA Topics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
          >
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Target size={16} className="text-purple-500" />
              All Topics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DSA_TOPICS.map((topic, i) => (
                <Link key={i} to={topic.path}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`${topic.bg} rounded-2xl p-3 text-center border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer`}
                  >
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center`}>
                      <topic.icon size={16} className="text-white" />
                    </div>
                    <p className={`text-xs font-bold ${topic.iconColor}`}>{topic.title}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Bookmarks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0  }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
          >
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Star size={16} className="text-yellow-500" />
              Bookmarks
            </h2>

            {loading ? (
              <div className="space-y-2">
                {[1,2].map(i => (
                  <div key={i} className="h-10 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">🔖</p>
                <p className="text-gray-400 text-xs">No bookmarks yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  Bookmark topics while visualizing!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((b, i) => (
                  <Link key={i} to={`/${b.category.replace('_', '-')}`}>
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
                      <Star size={12} className="text-yellow-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">{b.topic}</p>
                        <p className="text-xs text-gray-400">{b.operation}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Category breakdown */}
          {stats?.category_breakdown && Object.keys(stats.category_breakdown).length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0  }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
            >
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-green-500" />
                Progress by Category
              </h2>
              <div className="space-y-3">
                {Object.entries(stats.category_breakdown).map(([cat, data], i) => {
                  const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-300 font-medium capitalize">
                          {cat.replace('_', ' ')}
                        </span>
                        <span className="text-gray-400">{data.completed}/{data.total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-sky-500 to-purple-600 rounded-full"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Quick tip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0  }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl p-5 text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={16} />
              <p className="text-sm font-bold">Daily Tip</p>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Practice BFS and DFS daily — they form the foundation of most graph problems in interviews! 🎯
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ── Guest Dashboard ───────────────────────────
function GuestDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0  }}
        className="bg-gradient-to-r from-sky-500 to-purple-600 rounded-3xl p-8 text-white text-center"
      >
        <h1 className="text-3xl font-black mb-2">
          Master DSA Visually 🎯
        </h1>
        <p className="text-white/70 mb-6">
          Sign in to track your progress, save bookmarks and unlock all features
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/register"
            className="px-6 py-2.5 bg-white text-purple-600 font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="px-6 py-2.5 bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all flex items-center gap-2"
          >
            <LogIn size={16} /> Sign In
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {QUICK_STATS.map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-center"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Topics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6"
      >
        <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">
          Explore Topics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {DSA_TOPICS.map((topic, i) => (
            <Link key={i} to={topic.path}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`${topic.bg} rounded-2xl p-4 text-center border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer`}
              >
                <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center shadow-md`}>
                  <topic.icon size={20} className="text-white" />
                </div>
                <p className={`text-sm font-bold ${topic.iconColor}`}>{topic.title}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Sign in CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center"
      >
        <LogIn size={32} className="text-sky-500 mx-auto mb-3" />
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">
          Sign in to unlock all features
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Track progress, save bookmarks, and get personalized recommendations
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/login"
            className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
          >
            Register Free
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────
export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore()

  return isAuthenticated
    ? <LoggedInDashboard user={user} />
    : <GuestDashboard />
}