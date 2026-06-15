import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, RefreshCw } from 'lucide-react'
import useVisualizer from '../../hooks/useVisualizer'
import VisualizerLayout from '../../components/visualizer/VisualizerLayout'
import { arrayOperation } from '../../api/dsa'
import toast from 'react-hot-toast'

export default function ArrayVisualizer() {
  const [array, setArray] = useState([10, 20, 30, 40, 50])
  const [customArray, setCustomArray] = useState('10,20,30,40,50')
  const [operation, setOperation] = useState('insert')
  const [value, setValue] = useState('')
  const [index, setIndex] = useState('')
  const [complexity, setComplexity] = useState(null)

  const {
    currentStep, currentStepData, isPlaying,
    speed, isLoading, setIsLoading, setSpeed,
    play, pause, reset, nextStep, prevStep, loadSteps,
    totalSteps, progress
  } = useVisualizer()

  const handleSetArray = () => {
    try {
      const parsed = customArray
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n))
      if (parsed.length === 0) {
        toast.error('Enter valid numbers!')
        return
      }
      setArray(parsed)
      reset()
      setComplexity(null)
      toast.success('Array updated!')
    } catch {
      toast.error('Invalid input! Use comma separated numbers.')
    }
  }

  const handleRun = async () => {
    if (operation !== 'delete' && value === '') {
      toast.error('Please enter a value!')
      return
    }
    if (operation === 'delete' && index === '') {
      toast.error('Please enter an index to delete!')
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        array,
        operation,
        value: value !== '' ? parseInt(value) : undefined,
        index: index !== '' ? parseInt(index) : undefined,
      }
      const res = await arrayOperation(payload)
      loadSteps(res.data.steps)
      setComplexity(res.data.complexity)
      toast.success(`Ready! Press Play to visualize.`)
    } catch (err) {
      toast.error('Error running operation!')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setArray([10, 20, 30, 40, 50])
    setCustomArray('10,20,30,40,50')
    setValue('')
    setIndex('')
    reset()
    setComplexity(null)
  }

  const displayArray = currentStepData?.array || array
  const highlights = currentStepData?.highlights || []

  const controls = (
    <div className="space-y-3">

      {/* Custom Array Input */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Set Your Array
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customArray}
            onChange={e => setCustomArray(e.target.value)}
            placeholder="10,20,30,40,50"
            className="input text-sm flex-1"
          />
          <button
            onClick={handleSetArray}
            className="px-3 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold hover:bg-sky-600 transition-colors"
          >
            Set
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Comma separated numbers</p>
      </div>

      <div className="h-px bg-gray-100 dark:bg-slate-700" />

      {/* Operation Select */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Operation
        </label>
        <select
          value={operation}
          onChange={e => setOperation(e.target.value)}
          className="input text-sm"
        >
          <option value="insert">Insert</option>
          <option value="delete">Delete</option>
          <option value="search">Search</option>
          <option value="update">Update</option>
        </select>
      </div>

      {/* Value Input */}
      {operation !== 'delete' && (
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
            Value
          </label>
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter value..."
            className="input text-sm"
          />
        </div>
      )}

      {/* Index Input */}
      {(operation === 'insert' || operation === 'delete' || operation === 'update') && (
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
            Index {operation === 'insert' ? '(optional)' : '(required)'}
          </label>
          <input
            type="number"
            value={index}
            onChange={e => setIndex(e.target.value)}
            placeholder="Enter index..."
            className="input text-sm"
          />
        </div>
      )}

      {/* Current Array Display */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Current Array
        </label>
        <div className="flex flex-wrap gap-1">
          {array.map((val, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg font-mono font-bold"
            >
              {val}
            </span>
          ))}
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={handleRun}
        className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 text-sm"
      >
        Run Operation
      </button>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 text-sm flex items-center justify-center gap-2"
      >
        <RefreshCw size={14} /> Reset Array
      </button>
    </div>
  )

  const canvas = (
    <div className="space-y-6">

      {/* Title */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Array Visualization
        </h3>
        <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
        <span className="text-xs text-gray-400">
          Length: {displayArray.length}
        </span>
      </div>

      {/* Array Boxes */}
      <div className="flex flex-wrap items-end gap-3 min-h-32 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl">
        <AnimatePresence mode="popLayout">
          {displayArray.map((val, i) => {
            const isHighlighted = highlights.includes(i)
            return (
              <motion.div
                key={`${i}-${val}`}
                layout
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1,   y: 0   }}
                exit={{   opacity: 0, scale: 0.5,  y: 20  }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  animate={{
                    scale: isHighlighted ? 1.15 : 1,
                    y:     isHighlighted ? -8   : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl font-bold text-lg border-2 transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-gradient-to-br from-sky-500 to-purple-600 text-white border-sky-400 shadow-lg shadow-sky-500/40'
                      : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {val}
                </motion.div>
                <span className={`text-xs font-semibold ${
                  isHighlighted
                    ? 'text-sky-500'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  [{i}]
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {displayArray.length === 0 && (
          <div className="w-full text-center text-gray-400 py-8">
            Array is empty
          </div>
        )}
      </div>

      {/* Pointer Indicator */}
      {currentStepData?.pointer !== null &&
       currentStepData?.pointer !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm"
        >
          <span className="text-gray-400">Current pointer:</span>
          <span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg font-mono font-bold text-xs">
            index [{currentStepData.pointer}]
          </span>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600" />
          Normal
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-sky-500 to-purple-600" />
          Active / Highlighted
        </div>
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title="Array"
      icon={List}
      color="from-blue-500 to-cyan-500"
      controls={controls}
      canvas={canvas}
      isLoading={isLoading}
      complexity={complexity}
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
      isPlaying={isPlaying}
      onPlay={play}
      onPause={pause}
      onReset={reset}
      onNext={nextStep}
      onPrev={prevStep}
      speed={speed}
      onSpeedChange={setSpeed}
      stepData={currentStepData}
    />
  )
}