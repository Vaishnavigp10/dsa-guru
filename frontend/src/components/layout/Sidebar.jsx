import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, List, Link2, Layers, GitBranch,
  Network, Hash, ArrowUpDown, Home, ChevronDown, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const DSA_TOPICS = [
  {
    category: 'Linear',
    icon: List,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    items: [
      { label: 'Arrays',       path: '/array',       icon: List },
      { label: 'Linked Lists', path: '/linked-list', icon: Link2 },
      { label: 'Stacks',       path: '/stack',       icon: Layers },
      { label: 'Queues',       path: '/queue',       icon: GitBranch },
    ]
  },
  {
    category: 'Non-Linear',
    icon: Network,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    items: [
      { label: 'Trees',        path: '/tree',        icon: GitBranch },
      { label: 'Graphs',       path: '/graph',       icon: Network },
      { label: 'Hash Tables',  path: '/hash-table',  icon: Hash },
    ]
  },
  {
    category: 'Algorithms',
    icon: ArrowUpDown,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    items: [
      { label: 'Sorting',      path: '/sorting',     icon: ArrowUpDown },
    ]
  },
]

export default function Sidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState({})

  const toggleCategory = (cat) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  const isActive = (path) => location.pathname === path

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin">

      {/* Dashboard Link */}
      <div className="p-4">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive('/')
              ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Home size={16} />
          Home
        </Link>

        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mt-1 ${
            isActive('/dashboard')
              ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
      </div>

      <div className="px-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
          DSA Topics
        </p>
      </div>

      {/* DSA Categories */}
      <div className="px-3 pb-6 space-y-1">
        {DSA_TOPICS.map((group) => (
          <div key={group.category}>

            {/* Category Header */}
            <button
              onClick={() => toggleCategory(group.category)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <group.icon size={13} className={group.color} />
                {group.category}
              </div>
              {collapsed[group.category]
                ? <ChevronRight size={13} />
                : <ChevronDown size={13} />
              }
            </button>

            {/* Category Items */}
            <AnimatePresence initial={false}>
              {!collapsed[group.category] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-2 mt-1 space-y-0.5">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                          isActive(item.path)
                            ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold shadow-md shadow-sky-500/20'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-sky-500 dark:hover:text-sky-400'
                        }`}
                      >
                        <item.icon size={15} />
                        {item.label}
                        {isActive(item.path) && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Bottom Banner */}
      <div className="mt-auto p-4">
        <div className="bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl p-4 text-white">
          <p className="text-sm font-bold mb-1">DSA Guru Pro</p>
          <p className="text-xs opacity-80 mb-3">Master all DSA concepts with interactive visualizations</p>
          <div className="text-xs font-semibold bg-white/20 rounded-lg px-3 py-1.5 text-center">
            Start Learning
          </div>
        </div>
      </div>
    </aside>
  )
}