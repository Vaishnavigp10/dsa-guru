import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hash, RefreshCw, Plus } from 'lucide-react'
import useVisualizer from '../../hooks/useVisualizer'
import VisualizerLayout from '../../components/visualizer/VisualizerLayout'
import { hashOperation } from '../../api/dsa'
import toast from 'react-hot-toast'

const HASH_METHODS = [
  { value: 'chaining',   label: 'Chaining',         type: 'open'   },
  { value: 'linear',     label: 'Linear Probing',   type: 'closed' },
  { value: 'quadratic',  label: 'Quadratic Probing',type: 'closed' },
  { value: 'double',     label: 'Double Hashing',   type: 'closed' },
]

const SIZE = 10

export default function HashTableVisualizer() {
  const [hashMethod,  setHashMethod]  = useState('chaining')
  const [table,       setTable]       = useState(null)
  const [operation,   setOperation]   = useState('insert')
  const [key,         setKey]         = useState('')
  const [value,       setValue]       = useState('')
  const [complexity,  setComplexity]  = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [probeIndex,  setProbeIndex]  = useState(null)

  const {
    currentStep, currentStepData, isPlaying,
    speed, isLoading, setIsLoading, setSpeed,
    play, pause, reset, nextStep, prevStep, loadSteps,
    totalSteps, progress
  } = useVisualizer()

  const isChaining = hashMethod === 'chaining'

  const handleRun = async () => {
  if (!key) { toast.error('Please enter a key!'); return }
  if (operation === 'insert' && !value) { toast.error('Please enter a value!'); return }

  setIsLoading(true)
  try {
    const payload = {
      operation,
      key,
      value,
      hash_method: hashMethod,
      size:        SIZE,
    }

    // Only include table if it exists
    if (table !== null && table !== undefined) {
      if (isChaining) {
        payload.table = table
      } else {
        payload.table = Array.isArray(table) ? table : []
      }
    }

    const res = await hashOperation(payload)
    loadSteps(res.data.steps)
    setComplexity(res.data.complexity)
    if (operation === 'insert' || operation === 'delete') {
      setTable(res.data.final)
    }
    setActiveIndex(res.data.hash_index)
    toast.success('Ready! Press Play to visualize.')
  } catch (err) {
    toast.error('Error: ' + (err.response?.data?.error || 'Something went wrong'))
    console.error(err)
  } finally {
    setIsLoading(false)
  }
}
  const handleReset = () => {
    setTable(null)
    setKey('')
    setValue('')
    setActiveIndex(null)
    setProbeIndex(null)
    reset()
    setComplexity(null)
    toast.success('Hash table cleared!')
  }

  // Get display table from current step
  const displayTable  = currentStepData?.table  ?? table
  const stepHashIdx   = currentStepData?.hash_index  ?? activeIndex
  const stepProbeIdx  = currentStepData?.probe_index ?? null

  // Build chaining buckets display
  const chainingBuckets = Array.from({ length: SIZE }, (_, i) => {
    const bucket = displayTable ? (displayTable[String(i)] || []) : []
    return { index: i, entries: bucket }
  })

  // Build open addressing slots display
  const openAddressingSlots = Array.from({ length: SIZE }, (_, i) => {
    const slot = displayTable && Array.isArray(displayTable) ? displayTable[i] : null
    return { index: i, slot }
  })

  const controls = (
    <div className="space-y-3">

      {/* Hash Method */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Hashing Method
        </label>
        <div className="space-y-1">
          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
            Open Hashing (Chaining):
          </p>
          <div className="grid grid-cols-1 gap-1">
            {HASH_METHODS.filter(m => m.type === 'open').map(m => (
              <button
                key={m.value}
                onClick={() => { setHashMethod(m.value); setTable(null); reset() }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all text-left px-3 ${
                  hashMethod === m.value
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-2">
            Closed Hashing (Open Addressing):
          </p>
          <div className="grid grid-cols-1 gap-1">
            {HASH_METHODS.filter(m => m.type === 'closed').map(m => (
              <button
                key={m.value}
                onClick={() => { setHashMethod(m.value); setTable(null); reset() }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all text-left px-3 ${
                  hashMethod === m.value
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-slate-700" />

      {/* Method Info */}
      <div className={`text-xs p-3 rounded-xl ${
        isChaining
          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
      }`}>
        {hashMethod === 'chaining'  && '🔗 Chaining: Each bucket holds a linked list. Handles unlimited collisions.'}
        {hashMethod === 'linear'    && '➡️ Linear: On collision, try next slot. h(k,i) = (h(k) + i) % n'}
        {hashMethod === 'quadratic' && '📐 Quadratic: h(k,i) = (h(k) + i²) % n. Reduces clustering.'}
        {hashMethod === 'double'    && '✌️ Double: h(k,i) = (h1(k) + i*h2(k)) % n. Best distribution.'}
      </div>

      {/* Operation */}
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
          <option value="search">Search</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      {/* Key */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Key
        </label>
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="e.g. name, 42, city..."
          className="input text-sm"
        />
      </div>

      {/* Value */}
      {operation === 'insert' && (
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
            Value
          </label>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="e.g. Alice, 25, Paris..."
            className="input text-sm"
          />
        </div>
      )}

      {/* Hash index display */}
      {stepHashIdx !== null && stepHashIdx !== undefined && (
        <div className={`rounded-xl p-3 ${
          isChaining
            ? 'bg-yellow-50 dark:bg-yellow-900/20'
            : 'bg-blue-50 dark:bg-blue-900/20'
        }`}>
          <p className={`text-xs font-semibold ${
            isChaining
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-blue-600 dark:text-blue-400'
          }`}>
            Hash Index: {stepHashIdx}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            hash('{key}') % {SIZE} = {stepHashIdx}
          </p>
          {stepProbeIdx !== null && stepProbeIdx !== stepHashIdx && (
            <p className="text-xs text-orange-500 mt-1">
              Probe Index: {stepProbeIdx}
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleRun}
        className={`w-full py-2.5 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 text-sm bg-gradient-to-r ${
          isChaining
            ? 'from-yellow-500 to-orange-500'
            : 'from-blue-500 to-cyan-500'
        }`}
      >
        Run Operation
      </button>

      <button
        onClick={handleReset}
        className="w-full py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2"
      >
        <RefreshCw size={14} /> Clear Table
      </button>
    </div>
  )

  const canvas = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {isChaining ? 'Open Hashing — Chaining' : `Closed Hashing — ${HASH_METHODS.find(m => m.value === hashMethod)?.label}`}
        </h3>
        <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
        <span className="text-xs text-gray-400">Size: {SIZE}</span>
      </div>

      {/* Chaining View */}
      {isChaining && (
        <div className="space-y-1.5">
          {chainingBuckets.map(({ index, entries }) => {
            const isActive = stepHashIdx === index
            return (
              <motion.div
                key={index}
                animate={{ scale: isActive ? 1.02 : 1 }}
                className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${
                  isActive
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-md shadow-yellow-500/20'
                    : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-slate-800'
                }`}
              >
                {/* Bucket index */}
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold flex-shrink-0 ${
                  isActive
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {index}
                </div>

                {/* Arrow */}
                <span className="text-gray-300 dark:text-gray-600 text-xs">→</span>

                {/* Chain entries */}
                <div className="flex items-center gap-1 flex-1 flex-wrap">
                  {entries.length === 0 ? (
                    <span className="text-xs text-gray-300 dark:text-gray-600 italic">NULL</span>
                  ) : (
                    entries.map((pair, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex rounded-lg overflow-hidden border border-yellow-200 dark:border-yellow-800 shadow-sm"
                        >
                          <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-mono font-bold">
                            {pair[0]}
                          </div>
                          <div className="px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs font-mono border-l border-yellow-200 dark:border-yellow-800">
                            {pair[1]}
                          </div>
                        </motion.div>
                        {i < entries.length - 1 && (
                          <span className="text-gray-300 text-xs">→</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Open Addressing View */}
      {!isChaining && (
        <div className="space-y-1.5">
          {openAddressingSlots.map(({ index, slot }) => {
            const isHashSlot  = stepHashIdx  === index
            const isProbeSlot = stepProbeIdx === index
            const isEmpty     = slot === null || slot === undefined
            const isDeleted   = slot === '__DELETED__'

            return (
              <motion.div
                key={index}
                animate={{ scale: (isHashSlot || isProbeSlot) ? 1.02 : 1 }}
                className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${
                  isProbeSlot && !isHashSlot
                    ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                    : isHashSlot
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md shadow-blue-500/20'
                    : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-slate-800'
                }`}
              >
                {/* Slot index */}
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold flex-shrink-0 ${
                  isProbeSlot && !isHashSlot
                    ? 'bg-orange-500 text-white'
                    : isHashSlot
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {index}
                </div>

                {/* Slot content */}
                <div className="flex-1">
                  {isEmpty ? (
                    <span className="text-xs text-gray-300 dark:text-gray-600 italic">— empty —</span>
                  ) : isDeleted ? (
                    <span className="text-xs text-red-400 line-through italic">DELETED</span>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800 w-fit shadow-sm"
                    >
                      <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-mono font-bold">
                        {slot[0]}
                      </div>
                      <div className="px-2 py-1 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs font-mono border-l border-blue-200 dark:border-blue-800">
                        {slot[1]}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Probe indicator */}
                {(isHashSlot || isProbeSlot) && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isHashSlot && !isProbeSlot
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {isHashSlot && !isProbeSlot ? 'h(k)' : 'probe'}
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
        {isChaining ? (
          <>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-lg bg-yellow-500" />
              Active Bucket
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-4 rounded bg-yellow-100 border border-yellow-200" />
              Key:Value pair
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-lg bg-blue-500" />
              Hash Index h(k)
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-lg bg-orange-500" />
              Probe Index
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
              Deleted (tombstone)
            </div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title="Hash Table"
      icon={Hash}
      color="from-yellow-500 to-orange-500"
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