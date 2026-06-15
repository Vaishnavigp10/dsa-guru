import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Network, RefreshCw, Plus, Trash2 } from 'lucide-react'
import useVisualizer from '../../hooks/useVisualizer'
import VisualizerLayout from '../../components/visualizer/VisualizerLayout'
import { graphOperation } from '../../api/dsa'
import toast from 'react-hot-toast'

// ─── Preset Graphs ───────────────────────────
const PRESETS = {
  simple: {
    label: 'Simple Graph',
    graph: { "1": [2,3], "2": [4,5], "3": [5], "4": [], "5": [6], "6": [] },
    weighted: false,
  },
  weighted: {
    label: 'Weighted Graph',
    graph: {
      "1": [[2,4],[3,2]],
      "2": [[3,1],[4,5]],
      "3": [[4,8],[5,10]],
      "4": [[5,2]],
      "5": [],
    },
    weighted: true,
  },
  cyclic: {
    label: 'Cyclic Graph',
    graph: { "1": [2], "2": [3], "3": [4], "4": [2], "5": [1] },
    weighted: false,
  },
  dag: {
    label: 'DAG (Topo Sort)',
    graph: { "1": [3], "2": [3,4], "3": [5], "4": [5,6], "5": [], "6": [] },
    weighted: false,
  },
}

// ─── Fixed node positions for SVG ────────────
const NODE_POSITIONS = {
  1: { x: 300, y: 60  },
  2: { x: 150, y: 160 },
  3: { x: 450, y: 160 },
  4: { x: 80,  y: 280 },
  5: { x: 300, y: 280 },
  6: { x: 500, y: 300 },
  7: { x: 200, y: 380 },
  8: { x: 400, y: 380 },
}

// ─── SVG Graph Renderer ───────────────────────
function GraphSVG({
  graph, visited, current,
  highlightedEdges, mstEdges,
  distances, isWeighted,
  width = 600, height = 400
}) {
  const nodes   = Object.keys(graph).map(Number)
  const allEdges = []

  Object.entries(graph).forEach(([from, neighbors]) => {
    neighbors.forEach(n => {
      const to     = Array.isArray(n) ? n[0] : n
      const weight = Array.isArray(n) ? n[1] : null
      allEdges.push({ from: parseInt(from), to, weight })
    })
  })

  const isMstEdge = (from, to) =>
    mstEdges && mstEdges.some(e => (e[0] === from && e[1] === to) || (e[0] === to && e[1] === from))

  const isHighlightedEdge = (from, to) =>
    highlightedEdges && highlightedEdges.some(e => e[0] === from && e[1] === to)

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="visitedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="currentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="20" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#94a3b8" />
        </marker>
        <marker id="arrowHighlight" markerWidth="8" markerHeight="8" refX="20" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
        </marker>
        <marker id="arrowMst" markerWidth="8" markerHeight="8" refX="20" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {allEdges.map((edge, i) => {
        const fromPos = NODE_POSITIONS[edge.from]
        const toPos   = NODE_POSITIONS[edge.to]
        if (!fromPos || !toPos) return null

        const highlighted = isHighlightedEdge(edge.from, edge.to)
        const mst         = isMstEdge(edge.from, edge.to)
        const midX        = (fromPos.x + toPos.x) / 2
        const midY        = (fromPos.y + toPos.y) / 2

        return (
          <g key={`edge-${i}`}>
            <line
              x1={fromPos.x} y1={fromPos.y}
              x2={toPos.x}   y2={toPos.y}
              stroke={highlighted ? '#f59e0b' : mst ? '#10b981' : '#cbd5e1'}
              strokeWidth={highlighted || mst ? 3 : 2}
              markerEnd={`url(#${highlighted ? 'arrowHighlight' : mst ? 'arrowMst' : 'arrow'})`}
              strokeDasharray={mst ? '0' : '0'}
            />
            {/* Weight label */}
            {isWeighted && edge.weight !== null && (
              <g>
                <circle cx={midX} cy={midY} r={10} fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x={midX} y={midY + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6366f1">
                  {edge.weight}
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* Nodes */}
      {nodes.map(node => {
        const pos        = NODE_POSITIONS[node]
        if (!pos) return null
        const isVisited  = Array.isArray(visited) ? visited.includes(node) : false
        const isCurrent  = current === node
        const dist       = distances ? distances[String(node)] : null

        return (
          <g key={`node-${node}`}>
            {/* Glow for current */}
            {isCurrent && (
              <circle cx={pos.x} cy={pos.y} r={30} fill="rgba(245,158,11,0.2)" />
            )}
            {/* Main circle */}
            <circle
              cx={pos.x} cy={pos.y} r={24}
              fill={
                isCurrent  ? 'url(#currentGrad)' :
                isVisited  ? 'url(#visitedGrad)'  :
                '#f8fafc'
              }
              stroke={
                isCurrent  ? '#f59e0b' :
                isVisited  ? '#6366f1' :
                '#cbd5e1'
              }
              strokeWidth={isCurrent || isVisited ? 3 : 2}
              style={{ filter: isCurrent ? 'url(#glow)' : 'none' }}
            />
            {/* Node number */}
            <text
              x={pos.x} y={pos.y + 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill={isCurrent || isVisited ? '#ffffff' : '#374151'}
            >
              {node}
            </text>
            {/* Distance label for Dijkstra */}
            {dist !== null && dist !== undefined && (
              <g>
                <rect
                  x={pos.x + 18} y={pos.y - 32}
                  width={dist === 'INF' ? 28 : 22}
                  height={16}
                  rx={4}
                  fill={dist === 'INF' ? '#fef3c7' : '#dbeafe'}
                  stroke={dist === 'INF' ? '#f59e0b' : '#3b82f6'}
                  strokeWidth="1"
                />
                <text
                  x={pos.x + 18 + (dist === 'INF' ? 14 : 11)}
                  y={pos.y - 20}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill={dist === 'INF' ? '#92400e' : '#1d4ed8'}
                >
                  {dist === 'INF' ? '∞' : dist}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ─── Main Component ───────────────────────────
export default function GraphVisualizer() {
  const [preset,     setPreset]     = useState('simple')
  const [graph,      setGraph]      = useState(PRESETS.simple.graph)
  const [isWeighted, setIsWeighted] = useState(false)
  const [operation,  setOperation]  = useState('bfs')
  const [startNode,  setStartNode]  = useState('1')
  const [complexity, setComplexity] = useState(null)
  const [result,     setResult]     = useState(null)

  // Custom graph builder
  const [newNodeId,    setNewNodeId]    = useState('')
  const [newEdgeFrom,  setNewEdgeFrom]  = useState('')
  const [newEdgeTo,    setNewEdgeTo]    = useState('')
  const [newEdgeWeight,setNewEdgeWeight]= useState('1')

  const {
    currentStep, currentStepData, isPlaying,
    speed, isLoading, setIsLoading, setSpeed,
    play, pause, reset, nextStep, prevStep, loadSteps,
    totalSteps, progress
  } = useVisualizer()

  const handlePreset = (key) => {
    setPreset(key)
    setGraph(PRESETS[key].graph)
    setIsWeighted(PRESETS[key].weighted)
    reset()
    setResult(null)
    setComplexity(null)
    toast.success(`Loaded: ${PRESETS[key].label}`)
  }

  const handleAddNode = () => {
    if (!newNodeId) { toast.error('Enter node ID!'); return }
    const id = newNodeId.trim()
    if (graph[id]) { toast.error('Node already exists!'); return }
    setGraph(prev => ({ ...prev, [id]: [] }))
    setNewNodeId('')
    toast.success(`Node ${id} added!`)
  }

  const handleAddEdge = () => {
    if (!newEdgeFrom || !newEdgeTo) { toast.error('Enter both nodes!'); return }
    const from = newEdgeFrom.trim()
    const to   = parseInt(newEdgeTo.trim())
    if (!graph[from]) { toast.error(`Node ${from} doesn't exist!`); return }

    setGraph(prev => {
      const updated = { ...prev }
      if (isWeighted) {
        updated[from] = [...(updated[from] || []), [to, parseInt(newEdgeWeight) || 1]]
      } else {
        updated[from] = [...(updated[from] || []), to]
      }
      return updated
    })
    setNewEdgeFrom('')
    setNewEdgeTo('')
    setNewEdgeWeight('1')
    toast.success(`Edge ${from}→${to} added!`)
  }

  const handleRemoveNode = (nodeId) => {
    setGraph(prev => {
      const updated = { ...prev }
      delete updated[nodeId]
      // Remove edges pointing to this node
      Object.keys(updated).forEach(k => {
        updated[k] = updated[k].filter(n =>
          Array.isArray(n) ? n[0] !== parseInt(nodeId) : n !== parseInt(nodeId)
        )
      })
      return updated
    })
    toast.success(`Node ${nodeId} removed!`)
  }

  const handleRun = async () => {
    const needsStart = ['bfs', 'dfs', 'dijkstra', 'prims_mst'].includes(operation)
    if (needsStart && !startNode) {
      toast.error('Please select a start node!')
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        adjacency_list: graph,
        operation,
        start: parseInt(startNode) || 1,
      }
      const res = await graphOperation(payload)
      loadSteps(res.data.steps)
      setComplexity(res.data.complexity)
      setResult(res.data)
      toast.success('Ready! Press Play to visualize.')
    } catch (err) {
      toast.error('Error: ' + (err.response?.data?.error || 'Something went wrong'))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setGraph(PRESETS[preset].graph)
    setIsWeighted(PRESETS[preset].weighted)
    reset()
    setResult(null)
    setComplexity(null)
  }

  const visited          = currentStepData?.visited          || []
  const current          = currentStepData?.current          || null
  const highlightedEdges = currentStepData?.highlighted_edges || []
  const mstEdges         = currentStepData?.mst_edges        || []
  const distances        = currentStepData?.distances        || null

  const OPERATIONS = [
    { value: 'bfs',              label: 'BFS (Breadth First Search)',   needsStart: true  },
    { value: 'dfs',              label: 'DFS (Depth First Search)',     needsStart: true  },
    { value: 'dijkstra',         label: "Dijkstra's Shortest Path",     needsStart: true  },
    { value: 'cycle_detection',  label: 'Cycle Detection',             needsStart: false },
    { value: 'topological_sort', label: 'Topological Sort (DAG)',       needsStart: false },
    { value: 'prims_mst',        label: "Prim's MST",                  needsStart: true  },
  ]

  const currentOp = OPERATIONS.find(o => o.value === operation)

  const controls = (
    <div className="space-y-3">

      {/* Preset Selector */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Preset Graph
        </label>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                preset === key
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-slate-700" />

      {/* Add Node */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Add Node
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newNodeId}
            onChange={e => setNewNodeId(e.target.value)}
            placeholder="Node ID (e.g. 7)"
            className="input text-sm flex-1"
          />
          <button
            onClick={handleAddNode}
            className="px-3 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Add Edge */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Add Edge
        </label>
        <div className="flex gap-1">
          <input
            type="text"
            value={newEdgeFrom}
            onChange={e => setNewEdgeFrom(e.target.value)}
            placeholder="From"
            className="input text-sm w-16"
          />
          <input
            type="text"
            value={newEdgeTo}
            onChange={e => setNewEdgeTo(e.target.value)}
            placeholder="To"
            className="input text-sm w-16"
          />
          {isWeighted && (
            <input
              type="number"
              value={newEdgeWeight}
              onChange={e => setNewEdgeWeight(e.target.value)}
              placeholder="W"
              className="input text-sm w-12"
            />
          )}
          <button
            onClick={handleAddEdge}
            className="px-3 py-2 bg-purple-500 text-white rounded-xl text-xs font-bold hover:bg-purple-600 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Weighted toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsWeighted(!isWeighted)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            isWeighted ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-slate-600'
          }`}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            isWeighted ? 'translate-x-5' : 'translate-x-0.5'
          }`} />
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400">Weighted edges</span>
      </div>

      {/* Current nodes list */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Nodes
        </label>
        <div className="flex flex-wrap gap-1">
          {Object.keys(graph).map(n => (
            <div key={n} className="flex items-center gap-0.5">
              <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-mono font-bold">
                {n}
              </span>
              <button
                onClick={() => handleRemoveNode(n)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-slate-700" />

      {/* Operation */}
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
          Algorithm
        </label>
        <select
          value={operation}
          onChange={e => setOperation(e.target.value)}
          className="input text-sm"
        >
          {OPERATIONS.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>

      {/* Start Node */}
      {currentOp?.needsStart && (
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
            Start Node
          </label>
          <select
            value={startNode}
            onChange={e => setStartNode(e.target.value)}
            className="input text-sm"
          >
            {Object.keys(graph).map(n => (
              <option key={n} value={n}>Node {n}</option>
            ))}
          </select>
        </div>
      )}

      {/* Result display */}
      {result && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 space-y-1">
          {result.traversal_order && (
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Order: [{result.traversal_order.join(' → ')}]
            </p>
          )}
          {result.has_cycle !== undefined && (
            <p className={`text-xs font-bold ${result.has_cycle ? 'text-red-500' : 'text-green-500'}`}>
              {result.has_cycle ? '🔴 Cycle Detected!' : '✅ No Cycle (DAG)'}
            </p>
          )}
          {result.topological_order && (
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Topo: [{result.topological_order.join(' → ')}]
            </p>
          )}
          {result.total_cost !== undefined && (
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
              MST Cost: {result.total_cost}
            </p>
          )}
          {result.distances && (
            <div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Distances:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(result.distances).map(([k, v]) => (
                  <span key={k} className="text-xs px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded font-mono border border-indigo-200 dark:border-indigo-700">
                    {k}:{v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleRun}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 text-sm"
      >
        Run {currentOp?.label.split('(')[0].trim()}
      </button>

      <button
        onClick={handleReset}
        className="w-full py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2"
      >
        <RefreshCw size={14} /> Reset Graph
      </button>
    </div>
  )

  const canvas = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {currentOp?.label} Visualization
        </h3>
        <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
        <span className="text-xs text-gray-400">
          Nodes: {Object.keys(graph).length} | Edges: {Object.values(graph).flat().length}
        </span>
      </div>

      {/* Graph SVG */}
      <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl overflow-hidden">
        <GraphSVG
          graph={graph}
          visited={visited}
          current={current}
          highlightedEdges={highlightedEdges}
          mstEdges={mstEdges}
          distances={distances}
          isWeighted={isWeighted}
          width={600}
          height={420}
        />
      </div>

      {/* Step queue/stack display */}
      {currentStepData?.queue && currentStepData.queue.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {operation === 'bfs' ? 'Queue' : 'Stack'}:
          </span>
          <div className="flex gap-1">
            {currentStepData.queue.map((n, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg font-mono font-bold">
                {n}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-slate-700 border-2 border-gray-300" />
          Unvisited
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
          Visited
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-500 to-red-500" />
          Current
        </div>
        {operation === 'prims_mst' && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-green-500" />
            MST Edge
          </div>
        )}
        {operation === 'dijkstra' && (
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded bg-blue-100 border border-blue-300" />
            Distance
          </div>
        )}
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title="Graph"
      icon={Network}
      color="from-indigo-500 to-purple-600"
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