import { motion, AnimatePresence } from 'framer-motion'
import { Info, Lightbulb } from 'lucide-react'

export default function StepExplainer({ stepData, currentStep, totalSteps }) {
  if (!stepData) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
            <Info size={14} className="text-sky-500" />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Step Explanation
          </span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
          Configure an operation and press Play to start visualization...
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
            <Lightbulb size={14} className="text-sky-500" />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Step Explanation
          </span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0  }}
          exit={{   opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
            {stepData.description}
          </p>

          {/* Show result array/nodes if available */}
          {stepData.result && stepData.result.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Result so far:</p>
              <div className="flex flex-wrap gap-1">
                {stepData.result.map((val, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg font-mono font-semibold"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}