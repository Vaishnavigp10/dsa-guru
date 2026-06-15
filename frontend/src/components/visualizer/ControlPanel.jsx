import { motion } from 'framer-motion'
import {
  Play, Pause, RotateCcw, SkipBack, SkipForward,
  Gauge, ChevronLeft, ChevronRight
} from 'lucide-react'

export default function ControlPanel({
  isPlaying, onPlay, onPause, onReset,
  onNext, onPrev, speed, onSpeedChange,
  currentStep, totalSteps, progress
}) {
  const speedOptions = [
    { label: '0.5x', value: 1200 },
    { label: '1x',   value: 600  },
    { label: '1.5x', value: 400  },
    { label: '2x',   value: 200  },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 space-y-4">

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Step {totalSteps > 0 ? currentStep + 1 : 0} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-purple-600 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2">

        {/* Prev Step */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onPrev}
          disabled={currentStep === 0 || totalSteps === 0}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft size={18} />
        </motion.button>

        {/* Skip to Start */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onReset}
          disabled={totalSteps === 0}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <RotateCcw size={16} />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={isPlaying ? onPause : onPlay}
          disabled={totalSteps === 0}
          className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-lg shadow-sky-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isPlaying
            ? <Pause size={22} className="fill-current" />
            : <Play  size={22} className="fill-current ml-0.5" />
          }
        </motion.button>

        {/* Skip to End */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {}}
          disabled={totalSteps === 0}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <SkipForward size={16} />
        </motion.button>

        {/* Next Step */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Gauge size={13} />
          <span>Animation Speed</span>
        </div>
        <div className="flex gap-2">
          {speedOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSpeedChange(opt.value)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                speed === opt.value
                  ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}