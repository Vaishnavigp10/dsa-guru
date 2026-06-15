import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, RefreshCw, ArrowRight } from 'lucide-react'
import useVisualizer from '../../hooks/useVisualizer'
import VisualizerLayout from '../../components/visualizer/VisualizerLayout'
import { queueOperation } from '../../api/dsa'
import toast from 'react-hot-toast'

export default function QueueVisualizer() {
  const [queue, setQueue] = useState([10, 20, 30, 40])
  const [customQueue, setCustomQueue] = useState('10,20,30,40')
  const [operation, setOperation] = useState('enqueue')
  const [value, setValue] = useState('')
  const [complexity, setComplexity] = useState(null)

  const {
    currentStep, currentStepData, isPlaying,
    speed, isLoading, setIsLoading, setSpeed,
    play, pause, reset, nextStep, prevStep, loadSteps,
    totalSteps, progress
  } = useVisualizer()

  const handleSetQueue = () => {
    const parsed = customQueue.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
    if (parsed.length === 0) { toast.error('Enter valid numbers!'); return }
    setQueue(parsed)
    reset()
    setComplexity(null)
    toast.success('Queue updated!')
  }

  const handleRun = async () => {
    if (operation === 'enqueue' && value === '') {
      toast.error('Please enter a value!')
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        queue,
        operation,
        value: value !== '' ? parseInt(value) : undefined,
      }
      const res = await queueOperation(payload)
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
    setQueue([10, 20, 30, 40])
    setCustomQueue('10,20,30,40')
    setValue('')
    reset()
    setComplexity(null)
  }

  const displayQueue = currentStepData?.queue || queue
  const highlights = currentStepData?.highlights || []

  const controls = (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">Set Your Queue</label>
        <div className="flex gap-2">
          <input type="text" value={customQueue} onChange={e => setCustomQueue(e.target.value)} placeholder="10,20,30" className="input text-sm flex-1" />
          <button onClick={handleSetQueue} className="px-3 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-colors">Set</button>
        </div>
      </div>
      <div className="h-px bg-gray-100 dark:bg-slate-700" />
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">Operation</label>
        <select value={operation} onChange={e => setOperation(e.target.value)} className="input text-sm">
          <option value="enqueue">Enqueue (Add)</option>
          <option value="dequeue">Dequeue (Remove)</option>
        </select>
      </div>
      {operation === 'enqueue' && (
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">Value to Enqueue</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value..." className="input text-sm" />
        </div>
      )}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 space-y-1">
        <p className="text-xs text-green-600 dark:text-green-400 font-semibold">FRONT: {queue.length > 0 ? queue[0] : 'Empty'}</p>
        <p className="text-xs text-green-600 dark:text-green-400 font-semibold">REAR: {queue.length > 0 ? queue[queue.length - 1] : 'Empty'}</p>
        <p className="text-xs text-gray-400">Size: {queue.length}</p>
      </div>
      <button onClick={handleRun} className="w-full py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 text-sm">Run Operation</button>
      <button onClick={handleReset} className="w-full py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2">
        <RefreshCw size={14} /> Reset
      </button>
    </div>
  )

  const canvas = (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Queue Visualization (FIFO)</h3>
        <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
        <span className="text-xs text-gray-400">Size: {displayQueue.length}</span>
      </div>

      {/* FRONT/REAR labels */}
      <div className="flex justify-between text-xs font-bold px-4">
        <span className="text-green-500">FRONT (Dequeue)</span>
        <span className="text-blue-500">REAR (Enqueue)</span>
      </div>

      {/* Queue boxes */}
      <div className="flex items-center gap-2 min-h-20 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl overflow-x-auto">
        <AnimatePresence mode="popLayout">
          {displayQueue.map((val, i) => {
            const isFront = i === 0
            const isRear = i === displayQueue.length - 1
            const isHighlighted = highlights.includes(i)
            return (
              <motion.div
                key={`${i}-${val}`}
                layout
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-1 flex-shrink-0"
              >
                <motion.div
                  animate={{ scale: isHighlighted ? 1.1 : 1 }}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl font-bold text-sm border-2 transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-gradient-to-br from-green-500 to-teal-500 text-white border-green-400 shadow-lg'
                      : isFront
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-300 dark:border-green-700'
                      : isRear
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {val}
                </motion.div>
                <span className={`text-xs font-semibold ${
                  isFront ? 'text-green-500' : isRear ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  {isFront ? 'F' : isRear ? 'R' : i}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {displayQueue.length === 0 && (
          <div className="w-full text-center text-gray-400 py-4">Queue is empty</div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-200" />Front</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-200" />Rear</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-teal-500" />Active</div>
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title="Queue" icon={GitBranch} color="from-green-500 to-teal-500"
      controls={controls} canvas={canvas} isLoading={isLoading}
      complexity={complexity} currentStep={currentStep} totalSteps={totalSteps}
      progress={progress} isPlaying={isPlaying} onPlay={play} onPause={pause}
      onReset={reset} onNext={nextStep} onPrev={prevStep}
      speed={speed} onSpeedChange={setSpeed} stepData={currentStepData}
    />
  )
}