import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Code2, Zap, BookOpen, Trophy, ArrowRight,
  List, Link2, Layers, GitBranch, Network,
  Hash, ArrowUpDown, Play, Star, Users, Target
} from 'lucide-react'

const DSA_CARDS = [
  {
    title: 'Arrays',
    path: '/array',
    icon: List,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500',
    description: 'Insert, Delete, Search, Update',
    difficulty: 'Beginner',
    diffColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    ops: ['Insert', 'Delete', 'Search', 'Update'],
  },
  {
    title: 'Linked Lists',
    path: '/linked-list',
    icon: Link2,
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-500',
    description: 'Singly, Doubly, Circular',
    difficulty: 'Beginner',
    diffColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    ops: ['Insert', 'Delete', 'Traverse', 'Search'],
  },
  {
    title: 'Stacks',
    path: '/stack',
    icon: Layers,
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-500',
    description: 'Push, Pop, Peek operations',
    difficulty: 'Beginner',
    diffColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    ops: ['Push', 'Pop', 'Peek'],
  },
  {
    title: 'Queues',
    path: '/queue',
    icon: GitBranch,
    color: 'from-green-500 to-teal-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-500',
    description: 'Simple, Circular, Priority',
    difficulty: 'Intermediate',
    diffColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    ops: ['Enqueue', 'Dequeue', 'Peek'],
  },
  {
    title: 'Trees',
    path: '/tree',
    icon: GitBranch,
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    iconColor: 'text-pink-500',
    description: 'BST, AVL, Heap, Traversals',
    difficulty: 'Intermediate',
    diffColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    ops: ['Insert', 'Search', 'Inorder', 'Preorder'],
  },
  {
    title: 'Graphs',
    path: '/graph',
    icon: Network,
    color: 'from-indigo-500 to-purple-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-500',
    description: 'BFS, DFS, Traversals',
    difficulty: 'Advanced',
    diffColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    ops: ['BFS', 'DFS', 'Add Node', 'Add Edge'],
  },
  {
    title: 'Hash Tables',
    path: '/hash-table',
    icon: Hash,
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-500',
    description: 'Insert, Search, Delete',
    difficulty: 'Intermediate',
    diffColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    ops: ['Insert', 'Search', 'Delete'],
  },
  {
    title: 'Sorting',
    path: '/sorting',
    icon: ArrowUpDown,
    color: 'from-teal-500 to-green-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-500',
    description: 'Bubble, Merge, Quick, Heap',
    difficulty: 'Intermediate',
    diffColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    ops: ['Bubble', 'Merge', 'Quick', 'Insertion'],
  },
]

const FEATURES = [
  {
    icon: Play,
    title: 'Step-by-Step Visualization',
    desc: 'Watch algorithms execute step by step with play, pause, and speed controls.',
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
  },
  {
    icon: Zap,
    title: 'Interactive Learning',
    desc: 'Input your own data and see how algorithms behave in real time.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: BookOpen,
    title: 'AI DSA Assistant',
    desc: 'Ask doubts to our built-in AI chatbot and get instant explanations.',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: Trophy,
    title: 'Track Progress',
    desc: 'Track which topics you have mastered and bookmark your favorites.',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
]

const STATS = [
  { value: '8+',    label: 'Data Structures', icon: Code2 },
  { value: '50+',   label: 'Operations',      icon: Zap },
  { value: '100%',  label: 'Free to Use',     icon: Star },
  { value: '24/7',  label: 'AI Assistant',    icon: Users },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-20 px-6">

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-full text-sm font-semibold mb-6 border border-sky-200 dark:border-sky-800">
              <Zap size={14} className="fill-current" />
              Interactive DSA Learning Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Master{' '}
            <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              DSA
            </span>
            {' '}Visually
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-500 dark:text-gray-400 mb-4 max-w-2xl mx-auto leading-relaxed"
          >
            Your <strong className="text-gray-700 dark:text-gray-200">1 stop destination</strong> for all DSA ambiguities.
            Visualize, interact, and master every data structure and algorithm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <Link
              to="/array"
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-sky-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 hover:scale-105 text-lg"
            >
              <Play size={20} className="fill-current" />
              Start Visualizing
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-300 hover:scale-105 text-lg"
            >
              <Star size={20} />
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl font-black bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DSA Cards Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              Explore{' '}
              <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                Data Structures
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Click any topic to start an interactive visualization with step-by-step explanations
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {DSA_CARDS.map((card) => (
              <motion.div key={card.path} variants={itemVariants}>
                <Link to={card.path} className="block group">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 h-full">

                    {/* Icon */}
                    <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon size={24} className={card.iconColor} />
                    </div>

                    {/* Title + Difficulty */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-sky-500 transition-colors">
                        {card.title}
                      </h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.diffColor}`}>
                        {card.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {card.description}
                    </p>

                    {/* Operations */}
                    <div className="flex flex-wrap gap-1.5">
                      {card.ops.map((op) => (
                        <span
                          key={op}
                          className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg font-medium"
                        >
                          {op}
                        </span>
                      ))}
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center gap-1 mt-4 text-sky-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Visualize now <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              Why{' '}
              <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                DSA Guru?
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Everything you need to master Data Structures and Algorithms
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <feature.icon size={24} className={feature.color} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to Master DSA?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of students learning DSA visually and interactively.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-3.5 bg-white text-purple-600 font-bold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
            >
              <Target size={20} />
              Start for Free
            </Link>
            <Link
              to="/array"
              className="flex items-center gap-2 px-8 py-3.5 bg-white/20 backdrop-blur text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 text-lg"
            >
              <Play size={20} className="fill-current" />
              Try Visualizer
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Code2 size={20} className="text-sky-500" />
          <span className="text-white font-bold">DSA Guru</span>
        </div>
        <p className="text-gray-500 text-sm">
          1 stop destination for all of your DSA ambiguities.
        </p>
      </footer>
    </div>
  )
}