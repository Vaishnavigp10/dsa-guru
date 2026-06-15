import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, X, Send, Bot, User,
  RefreshCw, ChevronDown, Lightbulb
} from 'lucide-react'
import { sendMessage, getSuggestions } from '../../api/chatbot'
import ReactMarkdown from 'react-markdown'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `Hi! I am **DSA Guru Assistant**!

I can help you with:
- Data Structures (Arrays, Trees, Graphs...)
- Algorithms (Sorting, Searching...)
- Time and Space Complexity
- Interview Preparation

What would you like to learn today?`,
  id: 'welcome'
}

const TOPICS = [
  { value: 'general',     label: 'General'    },
  { value: 'array',       label: 'Arrays'     },
  { value: 'linked_list', label: 'LinkedList'  },
  { value: 'stack',       label: 'Stack'      },
  { value: 'queue',       label: 'Queue'      },
  { value: 'tree',        label: 'Trees'      },
  { value: 'graph',       label: 'Graphs'     },
  { value: 'sorting',     label: 'Sorting'    },
]

const DEFAULT_SUGGESTIONS = [
  "Explain bubble sort with example",
  "What is a BST?",
  "How does BFS work?",
  "What is Big O notation?",
]

export default function ChatBot() {
  const [isOpen,      setIsOpen]      = useState(false)
  const [messages,    setMessages]    = useState([WELCOME_MESSAGE])
  const [input,       setInput]       = useState('')
  const [isLoading,   setIsLoading]   = useState(false)
  const [sessionId,   setSessionId]   = useState(null)
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS)
  const [topic,       setTopic]       = useState('general')
  const [isMinimized, setIsMinimized] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, isMinimized])

  useEffect(() => {
    if (!isOpen) return
    const loadSuggestions = async () => {
      try {
        const res = await getSuggestions(topic)
        setSuggestions(res.data.suggestions || DEFAULT_SUGGESTIONS)
      } catch {
        setSuggestions(DEFAULT_SUGGESTIONS)
      }
    }
    loadSuggestions()
  }, [topic, isOpen])

  const handleSend = async (messageText = null) => {
  const text = messageText || input.trim()
  if (!text || isLoading) return

  const userMsg = {
    role:    'user',
    content: text,
    id:      Date.now().toString()
  }

  setMessages(prev => [...prev, userMsg])
  setInput('')
  setIsLoading(true)

  try {
    const payload = { message: text }
    if (sessionId)           payload.session_id    = sessionId
    if (topic !== 'general') payload.topic_context = topic

    const res = await sendMessage(payload)

    if (res.data.session_id) setSessionId(res.data.session_id)

    setMessages(prev => [...prev, {
      role:    'assistant',
      content: res.data.message,
      id:      Date.now().toString() + '_a'
    }])
  } catch (err) {
    console.error('Chat error:', err)
    setMessages(prev => [...prev, {
      role:    'assistant',
      content: `Sorry, I encountered an error: ${err.response?.data?.error || err.message || 'Please try again!'}`,
      id:      Date.now().toString() + '_err'
    }])
  } finally {
    setIsLoading(false)
  }
}

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    setMessages([WELCOME_MESSAGE])
    setSessionId(null)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl shadow-xl shadow-sky-500/30 flex items-center justify-center text-white"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{   rotate:  90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90,  opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{   rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{   opacity: 0, scale: 0.8,  y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-96 flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-black/20 border border-gray-100 dark:border-gray-700 overflow-hidden"
            style={{ maxHeight: '580px' }}
          >

            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-purple-600 p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">DSA Guru AI</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-white/70 text-xs">Always ready to help</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title="Clear chat"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col overflow-hidden"
                  style={{ maxHeight: '500px' }}
                >

                  {/* Topic Selector */}
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                      {TOPICS.map(t => (
                        <button
                          key={t.value}
                          onClick={() => setTopic(t.value)}
                          className={`flex-shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                            topic === t.value
                              ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin"
                    style={{ minHeight: '200px', maxHeight: '280px' }}
                  >
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0  }}
                        className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div className={`w-7 h-7 flex-shrink-0 rounded-xl flex items-center justify-center ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-sky-500 to-purple-600'
                            : 'bg-gradient-to-br from-green-400 to-teal-500'
                        }`}>
                          {msg.role === 'user'
                            ? <User size={13} className="text-white" />
                            : <Bot  size={13} className="text-white" />
                          }
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-xs rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-sky-500 to-purple-600 text-white rounded-tr-sm'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                        }`}>
                          {msg.role === 'assistant' ? (
                            <div className="prose prose-xs dark:prose-invert max-w-none">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p>{msg.content}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {/* Loading dots */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2"
                      >
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                          <Bot size={13} className="text-white" />
                        </div>
                        <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                          <div className="flex gap-1 items-center">
                            {[0, 1, 2].map(i => (
                              <motion.div
                                key={i}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestions */}
                  {suggestions.length > 0 && messages.length <= 1 && (
                    <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                      <div className="flex items-center gap-1 mb-1.5">
                        <Lightbulb size={11} className="text-yellow-500" />
                        <span className="text-xs text-gray-400 font-medium">Try asking:</span>
                      </div>
                      <div className="space-y-1">
                        {suggestions.slice(0, 3).map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(s)}
                            className="w-full text-left text-xs px-3 py-1.5 bg-gray-50 dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-500 rounded-xl transition-colors text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about any DSA topic..."
                        rows={1}
                        className="flex-1 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 scrollbar-thin"
                        style={{ minHeight: '38px', maxHeight: '80px' }}
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-sky-500 to-purple-600 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all"
                      >
                        <Send size={15} />
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      Enter to send · Shift+Enter for new line
                    </p>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}