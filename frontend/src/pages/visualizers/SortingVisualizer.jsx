import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, RefreshCw, Shuffle, Search, BarChart2, Grid } from 'lucide-react'
import useVisualizer from '../../hooks/useVisualizer'
import VisualizerLayout from '../../components/visualizer/VisualizerLayout'
import { sortingOperation } from '../../api/dsa'
import toast from 'react-hot-toast'

const ALGORITHMS = [
  { value: 'bubble',        label: 'Bubble Sort',    time: 'O(n²)',       space: 'O(1)',      color: '#ef4444', grad: 'from-red-500 to-orange-500'      },
  { value: 'selection',     label: 'Selection Sort', time: 'O(n²)',       space: 'O(1)',      color: '#f97316', grad: 'from-orange-500 to-yellow-500'    },
  { value: 'insertion',     label: 'Insertion Sort', time: 'O(n²)',       space: 'O(1)',      color: '#eab308', grad: 'from-yellow-500 to-lime-500'      },
  { value: 'merge',         label: 'Merge Sort',     time: 'O(n log n)',  space: 'O(n)',      color: '#22c55e', grad: 'from-green-500 to-teal-500'       },
  { value: 'quick',         label: 'Quick Sort',     time: 'O(n log n)',  space: 'O(log n)',  color: '#14b8a6', grad: 'from-teal-500 to-cyan-500'        },
  { value: 'heap',          label: 'Heap Sort',      time: 'O(n log n)',  space: 'O(1)',      color: '#0ea5e9', grad: 'from-cyan-500 to-blue-500'        },
  { value: 'shell',         label: 'Shell Sort',     time: 'O(n log² n)', space: 'O(1)',      color: '#6366f1', grad: 'from-blue-500 to-indigo-500'      },
  { value: 'counting',      label: 'Counting Sort',  time: 'O(n + k)',    space: 'O(k)',      color: '#a855f7', grad: 'from-indigo-500 to-purple-500'    },
  { value: 'radix',         label: 'Radix Sort',     time: 'O(d*(n+k))', space: 'O(n+k)',    color: '#ec4899', grad: 'from-purple-500 to-pink-500'      },
  { value: 'binary_search', label: 'Binary Search',  time: 'O(log n)',    space: 'O(1)',      color: '#f43f5e', grad: 'from-pink-500 to-rose-500'        },
]

// ── Circular / Radial View ────────────────────
function RadialView({ array, highlights, sorted, pivot, maxVal }) {
  const n      = array.length
  const cx     = 200
  const cy     = 200
  const radius = 150

  return (
    <svg width="400" height="400" viewBox="0 0 400 400" className="mx-auto">
      <defs>
        <filter id="sortGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx={cx} cy={cy} r={radius + 20} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-slate-700" />

      {array.map((val, i) => {
        const angle     = (i / n) * 2 * Math.PI - Math.PI / 2
        const barLength = Math.max((val / maxVal) * 120, 6)
        const x1 = cx + (radius - barLength) * Math.cos(angle)
        const y1 = cy + (radius - barLength) * Math.sin(angle)
        const x2 = cx + radius * Math.cos(angle)
        const y2 = cy + radius * Math.sin(angle)

        const isPivot     = pivot === i
        const isHighlight = highlights.includes(i)
        const isSorted    = sorted.includes(i)

        const color = isPivot      ? '#ef4444' :
                      isHighlight  ? '#f59e0b' :
                      isSorted     ? '#22c55e' :
                      '#6366f1'

        const strokeW = isPivot || isHighlight ? 4 : 2

        return (
          <g key={i}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              style={{ filter: isPivot || isHighlight ? 'url(#sortGlow)' : 'none' }}
            />
          </g>
        )
      })}

      {/* Center label */}
      <circle cx={cx} cy={cy} r={28} fill="white" className="dark:fill-slate-800" stroke="#e2e8f0" strokeWidth="2" className="dark:stroke-slate-700" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="10" fill="#6b7280" className="dark:fill-gray-400">sorted</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366f1">{sorted.length}/{array.length}</text>
    </svg>
  )
}

// ── Dot Grid View ─────────────────────────────
function DotGridView({ array, highlights, sorted, pivot }) {
  const cols = Math.ceil(Math.sqrt(array.length * 2))

  return (
    <div className="flex flex-wrap gap-2 justify-center p-4">
      {array.map((val, i) => {
        const isPivot     = pivot === i
        const isHighlight = highlights.includes(i)
        const isSorted    = sorted.includes(i)

        return (
          <motion.div
            key={i}
            layout
            animate={{
              scale:  isPivot ? 1.3 : isHighlight ? 1.15 : 1,
              rotate: isPivot ? 45 : 0,
            }}
            transition={{ duration: 0.3, type: 'spring' }}
            className={`flex flex-col items-center justify-center rounded-xl font-bold text-sm border-2 transition-colors duration-300 ${
              isPivot
                ? 'w-12 h-12 bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/40'
                : isHighlight
                ? 'w-12 h-12 bg-yellow-400 border-yellow-300 text-white shadow-lg shadow-yellow-400/40'
                : isSorted
                ? 'w-12 h-12 bg-green-500 border-green-400 text-white shadow-md shadow-green-500/30'
                : 'w-12 h-12 bg-white dark:bg-slate-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200'
            }`}
          >
            {val}
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Classic Bar View ──────────────────────────
function BarView({ array, highlights, sorted, pivot, maxVal, algoColor }) {
  return (
    <div className="flex items-end justify-center gap-1 h-52 px-2">
      <AnimatePresence mode="popLayout">
        {array.map((val, i) => {
          const barH      = Math.max((val / maxVal) * 180, 8)
          const isPivot   = pivot === i
          const isHL      = highlights.includes(i)
          const isSorted  = sorted.includes(i)

          const bgClass = isPivot   ? 'bg-gradient-to-t from-red-600 to-red-400'     :
                          isHL      ? 'bg-gradient-to-t from-yellow-500 to-yellow-300' :
                          isSorted  ? 'bg-gradient-to-t from-green-600 to-green-400'  :
                          `bg-gradient-to-t ${algoColor}`

          return (
            <motion.div
              key={i}
              layout
              className="flex flex-col items-center gap-0.5 flex-shrink-0"
              style={{ width: `${Math.max(96 / array.length - 0.5, 16)}px` }}
            >
              <motion.span
                animate={{ scale: isHL || isPivot ? 1.2 : 1 }}
                className={`text-xs font-bold ${
                  isPivot    ? 'text-red-500'    :
                  isHL       ? 'text-yellow-500' :
                  isSorted   ? 'text-green-500'  :
                  'text-gray-400 dark:text-gray-500'
                }`}
              >
                {val}
              </motion.span>
              <motion.div
                animate={{ height: barH }}
                transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
                className={`w-full rounded-t-lg ${bgClass} ${isPivot || isHL ? 'shadow-lg' : ''}`}
                style={{ height: barH }}
              />
              {isPivot && (
                <span className="text-xs font-black text-red-500">▲</span>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// ── Race Track View ───────────────────────────
function RaceView({ array, highlights, sorted, pivot, maxVal }) {
  const sortedOriginal = [...array].sort((a, b) => a - b)

  return (
    <div className="space-y-2 p-2">
      {array.map((val, i) => {
        const isPivot   = pivot === i
        const isHL      = highlights.includes(i)
        const isSorted  = sorted.includes(i)
        const pct       = Math.max((val / maxVal) * 100, 3)

        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400 w-6 text-right">{i}</span>
            <div className="flex-1 h-7 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.3, type: 'spring' }}
                className={`h-full rounded-full flex items-center justify-end pr-2 ${
                  isPivot    ? 'bg-gradient-to-r from-red-500 to-red-400 shadow-md'    :
                  isHL       ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 shadow-md' :
                  isSorted   ? 'bg-gradient-to-r from-green-500 to-green-400'          :
                  'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`}
              >
                <span className="text-xs font-bold text-white">{val}</span>
              </motion.div>
            </div>
            {isSorted && <span className="text-green-500 text-xs">✓</span>}
            {isPivot  && <span className="text-red-500 text-xs font-bold">P</span>}
          </div>
        )
      })}
    </div>
  )
}

// ── Main Component ────────────────────────────
export default function SortingVisualizer() {
  const [array,      setArray]      = useState([64, 34, 25, 12, 22, 11, 90])
  const [customArr,  setCustomArr]  = useState('64,34,25,12,22,11,90')
  const [algorithm,  setAlgorithm]  = useState('bubble')
  const [target,     setTarget]     = useState('')
  const [complexity, setComplexity] = useState(null)
  const [found,      setFound]      = useState(null)
  const [viewMode,   setViewMode]   = useState('bars') // bars | radial | dots | race

  const {
    currentStep, currentStepData, isPlaying,
    speed, isLoading, setIsLoading, setSpeed,
    play, pause, reset, nextStep, prevStep, loadSteps,
    totalSteps, progress
  } = useVisualizer()

  const currentAlgo    = ALGORITHMS.find(a => a.value === algorithm)
  const isBinarySearch = algorithm === 'binary_search'

  const handleSetArray = () => {
    const parsed = customArr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
    if (parsed.length === 0) { toast.error('Enter valid numbers!'); return }
    setArray(parsed)
    reset()
    setComplexity(null)
    setFound(null)
    toast.success('Array updated!')
  }

  const handleShuffle = () => {
    const shuffled = [...array].sort(() => Math.random() - 0.5)
    setArray(shuffled)
    setCustomArr(shuffled.join(','))
    reset()
    setComplexity(null)
    setFound(null)
  }

  const handleRandom = () => {
    const size   = Math.floor(Math.random() * 6) + 6
    const random = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
    setArray(random)
    setCustomArr(random.join(','))
    reset()
    setComplexity(null)
    setFound(null)
    toast.success('Random array generated!')
  }

  const handleRun = async () => {
    if (isBinarySearch && target === '') {
      toast.error('Please enter a target value!')
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        array,
        algorithm,
        ...(isBinarySearch && { target: parseInt(target) })
      }
      const res = await sortingOperation(payload)
      loadSteps(res.data.steps)
      setComplexity(res.data.complexity)
      if (res.data.found !== undefined) setFound(res.data.found)
      toast.success(`${res.data.steps.length} steps ready! Press Play.`)
    } catch (err) {
      toast.error('Error: ' + (err.response?.data?.error || 'Something went wrong'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setArray([64, 34, 25, 12, 22, 11, 90])
    setCustomArr('64,34,25,12,22,11,90')
    reset()
    setComplexity(null)
    setFound(null)
  }

  const displayArray = currentStepData?.array     || array
  const highlights   = currentStepData?.highlights || []
  const sorted       = currentStepData?.sorted     || []
  const pivot        = currentStepData?.pivot
  const maxVal       = Math.max(...displayArray, 1)

  const VIEW_MODES = [
    { value: 'bars',   label: 'Bars',    icon: BarChart2 },
    { value: 'race',   label: 'Race',    icon: ArrowUpDown },
    { value: 'dots',   label: 'Dots',    icon: Grid },
    { value: 'radial', label: 'Radial',  icon: RefreshCw },
  ]

  const controls = (
    <div className="space-y-3">

      {/* Array Input */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Set Array
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customArr}
            onChange={e => setCustomArr(e.target.value)}
            placeholder="64,34,25,12..."
            className="input text-sm flex-1"
          />
          <button onClick={handleSetArray} className="px-3 py-2 bg-teal-500 text-white rounded-xl text-xs font-bold hover:bg-teal-600 transition-colors">
            Set
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <button onClick={handleShuffle} className="py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors">
          <Shuffle size={12} /> Shuffle
        </button>
        <button onClick={handleRandom} className="py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors">
          🎲 Random
        </button>
      </div>

      <div className="h-px bg-gray-100 dark:bg-slate-700" />

      {/* Algorithm selector */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2 block">
          Algorithm
        </label>
        <div className="grid grid-cols-2 gap-1">
          {ALGORITHMS.map(algo => (
            <button
              key={algo.value}
              onClick={() => { setAlgorithm(algo.value); reset(); setFound(null) }}
              className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-left ${
                algorithm === algo.value
                  ? `bg-gradient-to-r ${algo.grad} text-white shadow-md`
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {algo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info card */}
      {currentAlgo && (
        <div className={`bg-gradient-to-r ${currentAlgo.grad} rounded-xl p-3 text-white`}>
          <p className="text-xs font-black mb-1">{currentAlgo.label}</p>
          <div className="flex gap-3 text-xs opacity-90">
            <span>⏱ {currentAlgo.time}</span>
            <span>💾 {currentAlgo.space}</span>
          </div>
        </div>
      )}

      {/* Binary search target */}
      {isBinarySearch && (
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
            Search Target
          </label>
          <input
            type="number"
            value={target}
            onChange={e => setTarget(e.target.value)}
            placeholder="Value to find..."
            className="input text-sm"
          />
          {found !== null && (
            <p className={`text-xs font-bold mt-1 ${found ? 'text-green-500' : 'text-red-500'}`}>
              {found ? `✅ Found ${target}!` : `❌ ${target} not found`}
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleRun}
        className={`w-full py-2.5 bg-gradient-to-r ${currentAlgo?.grad} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 text-sm`}
      >
        {isBinarySearch ? '🔍 Search' : '▶ Run Sort'}
      </button>

      <button onClick={handleReset} className="w-full py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2">
        <RefreshCw size={14} /> Reset
      </button>
    </div>
  )

  const canvas = (
    <div className="space-y-4">

      {/* Header + View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {currentAlgo?.label} — {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
        </h3>
        <div className="flex gap-1">
          {VIEW_MODES.map(v => (
            <button
              key={v.value}
              onClick={() => setViewMode(v.value)}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === v.value
                  ? `bg-gradient-to-r ${currentAlgo?.grad} text-white shadow-md`
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl overflow-hidden min-h-64">
        <AnimatePresence mode="wait">
          {viewMode === 'bars' && (
            <motion.div
              key="bars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              <BarView
                array={displayArray}
                highlights={highlights}
                sorted={sorted}
                pivot={pivot}
                maxVal={maxVal}
                algoColor={currentAlgo?.grad || 'from-teal-500 to-sky-400'}
              />
            </motion.div>
          )}

          {viewMode === 'radial' && (
            <motion.div
              key="radial"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              <RadialView
                array={displayArray}
                highlights={highlights}
                sorted={sorted}
                pivot={pivot}
                maxVal={maxVal}
              />
            </motion.div>
          )}

          {viewMode === 'dots' && (
            <motion.div
              key="dots"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 min-h-48"
            >
              <DotGridView
                array={displayArray}
                highlights={highlights}
                sorted={sorted}
                pivot={pivot}
              />
            </motion.div>
          )}

          {viewMode === 'race' && (
            <motion.div
              key="race"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              <RaceView
                array={displayArray}
                highlights={highlights}
                sorted={sorted}
                pivot={pivot}
                maxVal={maxVal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-2 text-center">
          <p className="text-lg font-black text-yellow-600 dark:text-yellow-400">
            {highlights.length}
          </p>
          <p className="text-xs text-gray-400">Comparing</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2 text-center">
          <p className="text-lg font-black text-green-600 dark:text-green-400">
            {sorted.length}
          </p>
          <p className="text-xs text-gray-400">Sorted</p>
        </div>
        <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-2 text-center">
          <p className="text-lg font-black text-sky-600 dark:text-sky-400">
            {totalSteps}
          </p>
          <p className="text-xs text-gray-400">Total Steps</p>
        </div>
      </div>

      {/* Complexity reference table */}
      <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4">
        <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
          Complexity Reference
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left pb-2">Algorithm</th>
                <th className="text-center pb-2">Best</th>
                <th className="text-center pb-2">Average</th>
                <th className="text-center pb-2">Worst</th>
                <th className="text-center pb-2">Space</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Bubble',    best: 'O(n)',      avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)'    },
                { name: 'Selection', best: 'O(n²)',     avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)'    },
                { name: 'Insertion', best: 'O(n)',      avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)'    },
                { name: 'Merge',     best: 'O(nlogn)',  avg: 'O(nlogn)',   worst: 'O(nlogn)',   space: 'O(n)'    },
                { name: 'Quick',     best: 'O(nlogn)',  avg: 'O(nlogn)',   worst: 'O(n²)',      space: 'O(logn)' },
                { name: 'Heap',      best: 'O(nlogn)',  avg: 'O(nlogn)',   worst: 'O(nlogn)',   space: 'O(1)'    },
                { name: 'Shell',     best: 'O(nlogn)',  avg: 'O(nlog²n)', worst: 'O(n²)',      space: 'O(1)'    },
                { name: 'Counting',  best: 'O(n+k)',    avg: 'O(n+k)',     worst: 'O(n+k)',     space: 'O(k)'    },
                { name: 'Radix',     best: 'O(d(n+k))', avg: 'O(d(n+k))', worst: 'O(d(n+k))', space: 'O(n+k)'  },
              ].map((row, i) => (
                <tr
                  key={i}
                  className={`border-t border-gray-100 dark:border-gray-800 ${
                    row.name.toLowerCase() === algorithm
                      ? 'bg-gradient-to-r from-sky-50 to-purple-50 dark:from-sky-900/20 dark:to-purple-900/20 font-bold'
                      : ''
                  }`}
                >
                  <td className={`py-1.5 pr-2 ${row.name.toLowerCase() === algorithm ? 'text-sky-600 dark:text-sky-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {row.name}
                  </td>
                  <td className="text-center py-1.5 font-mono text-gray-500 dark:text-gray-400">{row.best}</td>
                  <td className="text-center py-1.5 font-mono text-gray-500 dark:text-gray-400">{row.avg}</td>
                  <td className="text-center py-1.5 font-mono text-gray-500 dark:text-gray-400">{row.worst}</td>
                  <td className="text-center py-1.5 font-mono text-gray-500 dark:text-gray-400">{row.space}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className={`w-3 h-5 rounded bg-gradient-to-t ${currentAlgo?.grad}`} />
          Unsorted
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-5 rounded bg-yellow-400" />
          Comparing
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-5 rounded bg-red-500" />
          Pivot
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-5 rounded bg-green-500" />
          Sorted ✓
        </div>
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title={currentAlgo?.label || 'Sorting'}
      icon={isBinarySearch ? Search : ArrowUpDown}
      color={currentAlgo?.grad || 'from-teal-500 to-green-500'}
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