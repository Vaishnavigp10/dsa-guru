import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1  }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
        >
          <Code2 size={32} className="text-white" />
        </motion.div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-xl font-black bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
            DSA Guru
          </p>
          <p className="text-gray-400 text-sm mt-1">Loading...</p>
        </motion.div>
      </motion.div>
    </div>
  )
}