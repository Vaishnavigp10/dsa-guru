import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, RefreshCw } from 'lucide-react'
import useVisualizer from '../../hooks/useVisualizer'
import VisualizerLayout from '../../components/visualizer/VisualizerLayout'
import { treeOperation } from '../../api/dsa'
import toast from 'react-hot-toast'

// ─── SVG Tree Renderer ───────────────────────
function TreeSVG({ nodes, edges, highlights, colors, width = 580, height = 340 }) {
  if (!nodes || nodes.filter(n => n !== null && n !== undefined).length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Tree is empty — insert values to begin
      </div>
    )
  }

  const positions = {}

  function calcPos(idx, depth, left, right) {
    if (idx >= nodes.length || nodes[idx] === null || nodes[idx] === undefined) return
    const x = (left + right) / 2
    const y = 40 + depth * 72
    positions[idx] = { x, y }
    calcPos(2 * idx + 1, depth + 1, left,             (left + right) / 2)
    calcPos(2 * idx + 2, depth + 1, (left + right) / 2, right)
  }

  calcPos(0, 0, 40, width - 40)

  const validNodes = nodes
    .map((v, i) => ({ val: v, idx: i }))
    .filter(n => n.val !== null && n.val !== undefined)

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="treeNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ec4899" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Draw edges first */}
      {edges && edges.map((edge, i) => {
        const from = positions[edge.from]
        const to   = positions[edge.to]
        if (!from || !to) return null
        return (
          <line
            key={`edge-${i}`}
            x1={from.x} y1={from.y}
            x2={to.x}   y2={to.y}
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}

      {/* Draw nodes */}
      {validNodes.map(({ val, idx }) => {
        const pos         = positions[idx]
        if (!pos) return null
        const isHighlight = highlights && highlights.includes(idx)
        const isRed       = colors && colors[idx] === 'red'
        const isBlack     = colors && colors[idx] === 'black'

        // Determine fill color
        const fillColor = isHighlight
          ? 'url(#treeNodeGrad)'
          : isRed
          ? '#ef4444'
          : isBlack
          ? '#1e293b'
          : '#ffffff'

        // Determine stroke color
        const strokeColor = isHighlight
          ? '#a855f7'
          : isRed
          ? '#dc2626'
          : isBlack
          ? '#0f172a'
          : '#94a3b8'

        // Determine text color
        const textColor = (isHighlight || isRed || isBlack)
          ? '#ffffff'
          : '#1e293b'

        return (
          <g key={`node-${idx}`}>
            {/* Glow ring */}
            {isHighlight && (
              <circle
                cx={pos.x} cy={pos.y} r={28}
                fill="rgba(168,85,247,0.15)"
                stroke="rgba(168,85,247,0.4)"
                strokeWidth="2"
              />
            )}
            {/* Main circle */}
            <circle
              cx={pos.x} cy={pos.y} r={22}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={isHighlight ? 3 : 2}
              style={{ filter: isHighlight ? 'url(#nodeGlow)' : 'none' }}
            />
            {/* Value text */}
            <text
              x={pos.x} y={pos.y + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fill={textColor}
            >
              {val}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Main Component ───────────────────────────
export default function TreeVisualizer() {
  const DEFAULT_NODES = [50, 30, 70, 20, 40, 60, 80]
  const DEFAULT_EDGES = [
    { from: 0, to: 1 }, { from: 0, to: 2 },
    { from: 1, to: 3 }, { from: 1, to: 4 },
    { from: 2, to: 5 }, { from: 2, to: 6 },
  ]

  const [treeType,        setTreeType]        = useState('bst')
  const [heapType,        setHeapType]        = useState('max')
  const [nodes,           setNodes]           = useState(DEFAULT_NODES)
  const [edges,           setEdges]           = useState(DEFAULT_EDGES)
  const [colors,          setColors]          = useState(null)
  const [operation,       setOperation]       = useState('insert')
  const [value,           setValue]           = useState('')
  const [complexity,      setComplexity]      = useState(null)
  const [traversalResult, setTraversalResult] = useState([])
  const [customInput,     setCustomInput]     = useState('50,30,70,20,40,60,80')

  const {
    currentStep, currentStepData, isPlaying,
    speed, isLoading, setIsLoading, setSpeed,
    play, pause, reset, nextStep, prevStep, loadSteps,
    totalSteps, progress
  } = useVisualizer()

  const handleSetTree = () => {
    const parsed = customInput
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n))
    if (parsed.length === 0) { toast.error('Enter valid numbers!'); return }
    setNodes(parsed)
    setEdges([])
    setColors(null)
    reset()
    setComplexity(null)
    setTraversalResult([])
    toast.success('Tree updated! Run an operation to visualize.')
  }

  const handleRun = async () => {
    const needsValue = ['insert', 'search', 'delete'].includes(operation)
    if (needsValue && value === '') {
      toast.error('Please enter a value!')
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        nodes,
        operation,
        value:     value !== '' ? parseInt(value) : undefined,
        tree_type: treeType,
        heap_type: heapType,
      }
      const res = await treeOperation(payload)
      loadSteps(res.data.steps)
      setComplexity(res.data.complexity)

      if (res.data.edges)            setEdges(res.data.edges)
      if (res.data.colors)           setColors(res.data.colors)
      if (res.data.traversal_result) setTraversalResult(res.data.traversal_result)
      if (res.data.final) {
        setNodes(res.data.final)
        if (res.data.edges) setEdges(res.data.edges)
      }

      toast.success('Ready! Press Play to visualize.')
    } catch (err) {
      toast.error('Error: ' + (err.response?.data?.error || 'Something went wrong'))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setNodes(DEFAULT_NODES)
    setEdges(DEFAULT_EDGES)
    setColors(null)
    setCustomInput('50,30,70,20,40,60,80')
    setValue('')
    reset()
    setComplexity(null)
    setTraversalResult([])
  }

  const displayNodes  = currentStepData?.tree   || nodes
  const displayEdges  = currentStepData?.edges  !== undefined ? currentStepData.edges  : edges
  const displayColors = currentStepData?.colors !== undefined ? currentStepData.colors : colors
  const highlights    = currentStepData?.highlights || []

  const getOperations = () => {
    if (treeType === 'heap') return [
      { value: 'insert',     label: 'Insert'           },
      { value: 'extract',    label: 'Extract Root'     },
      { value: 'inorder',    label: 'View Heap Array'  },
    ]
    if (treeType === 'avl') return [
      { value: 'insert',     label: 'Insert (Auto-Balance)' },
      { value: 'delete',     label: 'Delete (Auto-Balance)' },
      { value: 'search',     label: 'Search'                },
      { value: 'inorder',    label: 'Inorder Traversal'     },
      { value: 'preorder',   label: 'Preorder Traversal'    },
      { value: 'postorder',  label: 'Postorder Traversal'   },
    ]
    if (treeType === 'rbt') return [
      { value: 'insert',     label: 'Insert (Auto-Color)'   },
      { value: 'search',     label: 'Search'                },
    ]
    // BST
    return [
      { value: 'insert',     label: 'Insert'                    },
      { value: 'search',     label: 'Search'                    },
      { value: 'delete',     label: 'Delete'                    },
      { value: 'inorder',    label: 'Inorder   (L → Root → R)' },
      { value: 'preorder',   label: 'Preorder  (Root → L → R)' },
      { value: 'postorder',  label: 'Postorder (L → R → Root)' },
      { value: 'levelorder', label: 'Level Order (BFS)'         },
    ]
  }

  const treeTypeInfo = {
    bst:  '🌳 BST: Left < Parent < Right. O(log n) avg operations',
    avl:  '⚖️ AVL: |h(Left) - h(Right)| ≤ 1. Auto-rotates to stay balanced!',
    heap: `🔺 ${heapType.toUpperCase()} Heap: Parent ${heapType === 'max' ? '≥' : '≤'} Children. O(log n) insert/extract`,
    rbt:  '🔴⚫ Red-Black: Root=Black. Red nodes have Black children. O(log n) guaranteed!',
  }

  const controls = (
    <div className="space-y-3">

      {/* Tree Type Selector */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Tree Type
        </label>
        <div className="grid grid-cols-2 gap-1">
          {[
            { value: 'bst',  label: 'BST'        },
            { value: 'avl',  label: 'AVL'        },
            { value: 'heap', label: 'Heap'       },
            { value: 'rbt',  label: 'Red-Black'  },
          ].map(t => (
            <button
              key={t.value}
              onClick={() => {
                setTreeType(t.value)
                setOperation('insert')
                setColors(null)
                reset()
                setTraversalResult([])
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                treeType === t.value
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heap Type */}
      {treeType === 'heap' && (
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
            Heap Type
          </label>
          <div className="grid grid-cols-2 gap-1">
            {['max', 'min'].map(h => (
              <button
                key={h}
                onClick={() => setHeapType(h)}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  heapType === h
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {h.toUpperCase()} Heap
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Input */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Set Initial Values
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="50,30,70,20..."
            className="input text-sm flex-1"
          />
          <button
            onClick={handleSetTree}
            className="px-3 py-2 bg-pink-500 text-white rounded-xl text-xs font-bold hover:bg-pink-600 transition-colors"
          >
            Set
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Comma separated numbers</p>
      </div>

      <div className="h-px bg-gray-100 dark:bg-slate-700" />

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
          {getOperations().map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>

      {/* Value Input */}
      {['insert', 'search', 'delete'].includes(operation) && (
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

      {/* Traversal Result */}
      {traversalResult.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            {operation.charAt(0).toUpperCase() + operation.slice(1)} Result:
          </p>
          <p className="text-xs font-mono text-gray-700 dark:text-gray-200 break-all leading-relaxed">
            [{traversalResult.join(' → ')}]
          </p>
        </div>
      )}

      {/* RBT Legend */}
      {treeType === 'rbt' && (
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-3 space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">RB Tree Rules:</p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-xs text-gray-600 dark:text-gray-300">RED node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-800 border border-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-300">BLACK node</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Root is always BLACK</p>
          <p className="text-xs text-gray-400">RED nodes have BLACK children</p>
        </div>
      )}

      {/* Current Nodes */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Current Nodes
        </label>
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
          {nodes
            .filter(n => n !== null && n !== undefined)
            .map((n, i) => (
              <span
                key={i}
                className="text-xs px-1.5 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded font-mono"
              >
                {n}
              </span>
            ))}
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={handleRun}
        className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 text-sm"
      >
        Run Operation
      </button>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2"
      >
        <RefreshCw size={14} /> Reset Tree
      </button>
    </div>
  )

  const canvas = (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {treeType === 'bst'  && 'Binary Search Tree (BST)'}
          {treeType === 'avl'  && 'AVL Tree — Self Balancing'}
          {treeType === 'heap' && `${heapType.toUpperCase()} Heap`}
          {treeType === 'rbt'  && 'Red-Black Tree'}
        </h3>
        <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
        <span className="text-xs text-gray-400">
          Nodes: {displayNodes.filter(n => n !== null && n !== undefined).length}
        </span>
      </div>

      {/* Info Banner */}
      <div className={`text-xs px-3 py-2 rounded-xl font-medium ${
        treeType === 'avl'
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          : treeType === 'heap'
          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
          : treeType === 'rbt'
          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          : 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
      }`}>
        {treeTypeInfo[treeType]}
      </div>

      {/* SVG Tree Canvas */}
      <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 overflow-x-auto min-h-72">
        <TreeSVG
          nodes={displayNodes}
          edges={displayEdges}
          highlights={highlights}
          colors={displayColors}
          width={580}
          height={340}
        />
      </div>

      {/* Step traversal result */}
      {currentStepData?.result && currentStepData.result.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-xs text-gray-400 mr-1">Visited:</span>
          {currentStepData.result.map((v, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="text-xs px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg font-mono font-bold"
            >
              {v}
            </motion.span>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-white dark:bg-slate-700 border-2 border-gray-300" />
          Normal
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600" />
          Active
        </div>
        {treeType === 'rbt' && (
          <>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              RED
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-slate-800 border border-gray-500" />
              BLACK
            </div>
          </>
        )}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-gray-300 dark:bg-gray-600" />
          Edge
        </div>
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title={
        treeType === 'bst'  ? 'BST'             :
        treeType === 'avl'  ? 'AVL Tree'        :
        treeType === 'rbt'  ? 'Red-Black Tree'  :
        `${heapType.toUpperCase()} Heap`
      }
      icon={GitBranch}
      color="from-pink-500 to-rose-500"
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