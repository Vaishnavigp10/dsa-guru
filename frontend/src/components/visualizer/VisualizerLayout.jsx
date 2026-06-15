import { motion } from 'framer-motion'
import ControlPanel from './ControlPanel'
import StepExplainer from './StepExplainer'
import ComplexityBadge from './ComplexityBadge'
import { Loader2 } from 'lucide-react'

export default function VisualizerLayout({
  title, icon: Icon, color = 'from-sky-500 to-purple-600',
  controls, canvas, visualizer,
  isLoading, complexity,
  currentStep, totalSteps, progress,
  isPlaying, onPlay, onPause, onReset, onNext, onPrev,
  speed, onSpeedChange,
  stepData,
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0  }}
          className="flex items-center gap-3"
        >
          <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
            {Icon && <Icon size={20} className="text-white" />}
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">
              {title} Visualizer
            </h1>
            <p className="text-xs text-gray-400">
              Interactive step-by-step visualization
            </p>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

          {/* Left Panel — Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0  }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-1 space-y-4"
          >
            {/* Operation Controls */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Configure Operation
              </p>
              {controls}
            </div>

            {/* Playback Controls */}
            <ControlPanel
              isPlaying={isPlaying}
              onPlay={onPlay}
              onPause={onPause}
              onReset={onReset}
              onNext={onNext}
              onPrev={onPrev}
              speed={speed}
              onSpeedChange={onSpeedChange}
              currentStep={currentStep}
              totalSteps={totalSteps}
              progress={progress}
            />

            {/* Complexity */}
            <ComplexityBadge complexity={complexity} />

            {/* Step Explainer */}
            <StepExplainer
              stepData={stepData}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </motion.div>

          {/* Right Panel — Canvas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0  }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-3"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 min-h-96 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="text-sky-500 animate-spin" />
                    <p className="text-sm text-gray-400">Computing steps...</p>
                  </div>
                </div>
              ) : (
                canvas
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}