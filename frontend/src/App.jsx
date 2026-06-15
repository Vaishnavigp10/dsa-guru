import NotFound from './pages/NotFound'

// Add at end of routes:
<Route path="*" element={<NotFound />} />
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import useThemeStore from './store/useThemeStore'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ArrayVisualizer from './pages/visualizers/ArrayVisualizer'
import LinkedListVisualizer from './pages/visualizers/LinkedListVisualizer'
import StackVisualizer from './pages/visualizers/StackVisualizer'
import QueueVisualizer from './pages/visualizers/QueueVisualizer'
import TreeVisualizer from './pages/visualizers/TreeVisualizer'
import GraphVisualizer from './pages/visualizers/GraphVisualizer'
import HashTableVisualizer from './pages/visualizers/HashTableVisualizer'
import SortingVisualizer from './pages/visualizers/SortingVisualizer'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import ChatBot from './components/chatbot/ChatBot'

export default function App() {
  const { darkMode } = useThemeStore()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: darkMode ? '#1e293b' : '#ffffff',
            color:      darkMode ? '#f1f5f9' : '#0f172a',
            border:     darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
          },
          duration: 3000,
        }}
      />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen transition-colors duration-300">
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/array"       element={<ArrayVisualizer />} />
            <Route path="/linked-list" element={<LinkedListVisualizer />} />
            <Route path="/stack"       element={<StackVisualizer />} />
            <Route path="/queue"       element={<QueueVisualizer />} />
            <Route path="/tree"        element={<TreeVisualizer />} />
            <Route path="/graph"       element={<GraphVisualizer />} />
            <Route path="/hash-table"  element={<HashTableVisualizer />} />
            <Route path="/sorting"     element={<SortingVisualizer />} />
          </Routes>
        </main>
      </div>
      <ChatBot />
    </div>
  )
}