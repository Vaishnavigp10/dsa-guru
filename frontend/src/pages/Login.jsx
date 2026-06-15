import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Code2, ArrowRight, Loader2 } from 'lucide-react'
import { login } from '../api/auth'
import useAuthStore from '../store/useAuthStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [isLoading,  setIsLoading]  = useState(false)
  const [errors,     setErrors]     = useState({})

  const { setAuth }  = useAuthStore()
  const navigate     = useNavigate()

  const validate = () => {
    const errs = {}
    if (!email)                        errs.email    = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(email))   errs.email    = 'Enter a valid email'
    if (!password)                     errs.password = 'Password is required'
    if (password.length < 6)           errs.password = 'Password too short'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      const res = await login({ email, password })
      const { access, refresh } = res.data

      // Get user profile
      const { getProfile } = await import('../api/auth')
      const profileRes = await getProfile()

      setAuth(profileRes.data, access, refresh)
      toast.success(`Welcome back, ${profileRes.data.username}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail ||
                  err.response?.data?.non_field_errors?.[0] ||
                  'Invalid email or password'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 dark:border-gray-700 p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code2 size={22} className="text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                DSA Guru
              </span>
            </Link>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Welcome back!
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to continue your DSA journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* General error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0  }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors({}) }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-200 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500/30 focus:border-red-400'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-sky-500/30 focus:border-sky-400'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors({}) }}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm transition-all duration-200 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500/30 focus:border-red-400'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-sky-500/30 focus:border-sky-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
          </div>

          {/* Continue without login */}
          <Link
            to="/"
            className="w-full py-3 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            Continue without signing in
          </Link>

          {/* Register link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}