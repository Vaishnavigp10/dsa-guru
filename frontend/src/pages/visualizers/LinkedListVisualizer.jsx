import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link2, RefreshCw, ArrowRight } from 'lucide-react'
import useVisualizer from '../../hooks/useVisualizer'
import VisualizerLayout from '../../components/visualizer/VisualizerLayout'
import { linkedListOp } from '../../api/dsa'
import toast from 'react-hot-toast'

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState([10, 20, 30, 40, 50])
  const [customNodes, setCustomNodes] = useState('10,20,30,40,50')
  const [operation, setOperation] = useState('insert')
  const [value, setValue] = useState('')
  const [position, setPosition] = useState('')
  const [complexity, setComplexity] = useState(null)

  const {
    currentStep, currentStepData, isPlaying,
    speed, isLoading, setIsLoading, setSpeed,
    play, pause, reset, nextStep, prevStep, loadSteps,
    totalSteps, progress
  } = useVisualizer()

  const handleSetNodes = () => {
    const parsed = customNodes.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
    if (parsed.length === 0) { toast.error('Enter valid numbers!'); return }
    setNodes(parsed)
    reset()
    setComplexity(null)
    toast.success('Linked List updated!')
  }

  const handleRun = async () => {
    if (operation !== 'traverse' && operation !== 'delete' && value === '') {
      toast.error('Please enter a value!')
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        nodes,
        operation,
        value: value !== '' ? parseInt(value) : undefined,
        position: position !== '' ? parseInt(position) : undefined,
      }
      const res = await linkedListOp(payload)
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
    setNodes([10, 20, 30, 40, 50])
    setCustomNodes('10,20,30,40,50')
    setValue('')
    setPosition('')
    reset()
    setComplexity(null)
  }

  const displayNodes = currentStepData?.nodes || nodes
  const highlights = currentStepData?.highlights || []
  const activeNode = currentStepData?.active_node

  const controls = (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">Set Your List</label>
        <div className="flex gap-2">
          <input type="text" value={customNodes} onChange={e => setCustomNodes(e.target.value)} placeholder="10,20,30" className="input text-sm flex-1" />
          <button onClick={handleSetNodes} className="px-3 py-2 bg-purple-500 text-white rounded-xl text-xs font-bold hover:bg-purple-600 transition-colors">Set</button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Comma separated numbers</p>
      </div>
      <div className="h-px bg-gray-100 dark:bg-slate-700" />
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">Operation</label>
        <select value={operation} onChange={e => setOperation(e.target.value)} className="input text-sm">
          <option value="insert">Insert</option>
          <option value="delete">Delete</option>
          <option value="search">Search</option>
          <option value="traverse">Traverse</option>
        </select>
      </div>
      {operation !== 'traverse' && (
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">Value</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value..." className="input text-sm" />
        </div>
      )}
      {operation === 'insert' && (
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">Position (optional)</label>
          <input type="number" value={position} onChange={e => setPosition(e.target.value)} placeholder="Enter position..." className="input text-sm" />
        </div>
      )}
      <button onClick={handleRun} className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 text-sm">Run Operation</button>
      <button onClick={handleReset} className="w-full py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2">
        <RefreshCw size={14} /> Reset
      </button>
    </div>
  )

  const canvas = (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Linked List Visualization</h3>
        <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
        <span className="text-xs text-gray-400">Nodes: {displayNodes.length}</span>
      </div>

      {/* Linked List Nodes */}
      <div className="flex flex-wrap items-center gap-1 min-h-32 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl overflow-x-auto">
        {/* HEAD label */}
        {displayNodes.length > 0 && (
          <div className="flex flex-col items-center mr-1">
            <span className="text-xs font-bold text-purple-500 mb-1">HEAD</span>
            <ArrowRight size={16} className="text-purple-400" />
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {displayNodes.map((val, i) => {
            const isHighlighted = highlights.includes(i) || activeNode === i
            return (
              <motion.div
                key={`${i}-${val}`}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                {/* Node Box */}
                <motion.div
                  animate={{ scale: isHighlighted ? 1.1 : 1 }}
                  className={`flex rounded-xl border-2 overflow-hidden shadow-sm ${
                    isHighlighted
                      ? 'border-purple-400 shadow-purple-500/30 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {/* Data */}
                  <div className={`w-12 h-12 flex items-center justify-center font-bold text-sm ${
                    isHighlighted
                      ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'
                      : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200'
                  }`}>
                    {val}
                  </div>
                  {/* Next pointer */}
                  <div className={`w-8 h-12 flex items-center justify-center text-xs font-mono ${
                    isHighlighted
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-600 text-gray-400'
                  }`}>
                    →
                  </div>
                </motion.div>

                {/* Arrow between nodes */}
                {i < displayNodes.length - 1 && (
                  <ArrowRight size={14} className="text-gray-300 dark:text-gray-600 mx-0.5" />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* NULL */}
        {displayNodes.length > 0 && (
          <span className="text-xs font-bold text-gray-400 ml-1">NULL</span>
        )}

        {displayNodes.length === 0 && (
          <div className="w-full text-center text-gray-400 py-8">List is empty — HEAD → NULL</div>
        )}
      </div>

      {/* Index labels */}
      <div className="flex flex-wrap gap-1">
        {displayNodes.map((val, i) => (
          <span key={i} className="text-xs text-gray-400 w-20 text-center">pos {i}</span>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-white dark:bg-slate-700 border-2 border-gray-200" />Normal
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-pink-600" />Active
        </div>
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title="Linked List" icon={Link2} color="from-purple-500 to-pink-500"
      controls={controls} canvas={canvas} isLoading={isLoading}
      complexity={complexity} currentStep={currentStep} totalSteps={totalSteps}
      progress={progress} isPlaying={isPlaying} onPlay={play} onPause={pause}
      onReset={reset} onNext={nextStep} onPrev={prevStep}
      speed={speed} onSpeedChange={setSpeed} stepData={currentStepData}
    />
  )
}