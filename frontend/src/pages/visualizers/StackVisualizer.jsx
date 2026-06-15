import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, RefreshCw } from 'lucide-react'
import useVisualizer from '../../hooks/useVisualizer'
import VisualizerLayout from '../../components/visualizer/VisualizerLayout'
import { stackOperation } from '../../api/dsa'
import toast from 'react-hot-toast'

export default function StackVisualizer() {
  const [stack, setStack] = useState([10, 20, 30])
  const [customStack, setCustomStack] = useState('10,20,30')
  const [operation, setOperation] = useState('push')
  const [value, setValue] = useState('')
  const [complexity, setComplexity] = useState(null)

  const {
    currentStep, currentStepData, isPlaying,
    speed, isLoading, setIsLoading, setSpeed,
    play, pause, reset, nextStep, prevStep, loadSteps,
    totalSteps, progress
  } = useVisualizer()

  const handleSetStack = () => {
    const parsed = customStack.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
    if (parsed.length === 0) { toast.error('Enter valid numbers!'); return }
    setStack(parsed)
    reset()
    setComplexity(null)
    toast.success('Stack updated!')
  }

  const handleRun = async () => {
    if (operation === 'push' && value === '') {
      toast.error('Please enter a value to push!')
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        stack,
        operation,
        value: value !== '' ? parseInt(value) : undefined,
      }
      const res = await stackOperation(payload)
      loadSteps(res.data.steps)
      setComplexity(res.data.complexity)
      toast.success('Ready! Press Play to visualize.')
    } catch (err) {
      toast.error('Error running operation!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStack([10, 20, 30])
    setCustomStack('10,20,30')
    setValue('')
    reset()
    setComplexity(null)
  }

  const displayStack = currentStepData?.stack || stack
  const highlights = currentStepData?.highlights || []
  const topIndex = displayStack.length - 1

  const controls = (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">Set Your Stack</label>
        <div className="flex gap-2">
          <input type="text" value={customStack} onChange={e => setCustomStack(e.target.value)} placeholder="10,20,30" className="input text-sm flex-1" />
          <button onClick={handleSetStack} className="px-3 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors">Set</button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Comma separated numbers</p>
      </div>
      <div className="h-px bg-gray-100 dark:bg-slate-700" />
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">Operation</label>
        <select value={operation} onChange={e => setOperation(e.target.value)} className="input text-sm">
          <option value="push">Push</option>
          <option value="pop">Pop</option>
          <option value="peek">Peek</option>
        </select>
      </div>
      {operation === 'push' && (
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">Value to Push</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value..." className="input text-sm" />
        </div>
      )}
      {/* Stack info */}
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3">
        <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
          TOP: {stack.length > 0 ? stack[stack.length - 1] : 'Empty'}
        </p>
        <p className="text-xs text-gray-400 mt-1">Size: {stack.length}</p>
      </div>
      <button onClick={handleRun} className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 text-sm">Run Operation</button>
      <button onClick={handleReset} className="w-full py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2">
        <RefreshCw size={14} /> Reset
      </button>
    </div>
  )

  const canvas = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Stack Visualization (LIFO)</h3>
        <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
        <span className="text-xs text-gray-400">Size: {displayStack.length}</span>
      </div>

      <div className="flex justify-center">
        <div className="w-48 space-y-1">
          {/* TOP label */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px bg-dashed border-t-2 border-dashed border-orange-300 dark:border-orange-700" />
            <span className="text-xs font-bold text-orange-500">TOP</span>
            <div className="flex-1 h-px border-t-2 border-dashed border-orange-300 dark:border-orange-700" />
          </div>

          {/* Stack items — rendered bottom to top */}
          <div className="flex flex-col-reverse gap-1">
            <AnimatePresence mode="popLayout">
              {displayStack.map((val, i) => {
                const isTop = i === topIndex
                const isHighlighted = highlights.includes(i)
                return (
                  <motion.div
                    key={`${i}-${val}`}
                    layout
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full h-12 flex items-center justify-between px-4 rounded-xl border-2 font-bold text-sm transition-all duration-300 ${
                      isHighlighted || isTop
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-400 shadow-lg shadow-orange-500/30'
                        : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <span>{val}</span>
                    {isTop && <span className="text-xs opacity-70">← TOP</span>}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Bottom */}
          <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-b-xl mt-1" />
          <p className="text-center text-xs text-gray-400 mt-1">BOTTOM</p>

          {displayStack.length === 0 && (
            <div className="w-full h-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-xs text-gray-400">Stack is Empty</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title="Stack" icon={Layers} color="from-orange-500 to-red-500"
      controls={controls} canvas={canvas} isLoading={isLoading}
      complexity={complexity} currentStep={currentStep} totalSteps={totalSteps}
      progress={progress} isPlaying={isPlaying} onPlay={play} onPause={pause}
      onReset={reset} onNext={nextStep} onPrev={prevStep}
      speed={speed} onSpeedChange={setSpeed} stepData={currentStepData}
    />
  )
}