import { Clock, Database } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ComplexityBadge({ complexity }) {
  if (!complexity) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0  }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4"
    >
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Complexity Analysis
      </p>
      <div className="flex gap-3">
        <div className="flex-1 bg-sky-50 dark:bg-sky-900/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={12} className="text-sky-500" />
            <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">Time</span>
          </div>
          <p className="text-sm font-bold text-gray-800 dark:text-white font-mono">
            {complexity.time}
          </p>
        </div>
        <div className="flex-1 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Database size={12} className="text-purple-500" />
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Space</span>
          </div>
          <p className="text-sm font-bold text-gray-800 dark:text-white font-mono">
            {complexity.space}
          </p>
        </div>
      </div>
    </motion.div>
  )
}