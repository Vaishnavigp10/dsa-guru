import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail, Lock, Eye, EyeOff, Code2,
  ArrowRight, Loader2, User, CheckCircle2
} from 'lucide-react'
import { register } from '../api/auth'
import useAuthStore from '../store/useAuthStore'
import toast from 'react-hot-toast'

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8          },
  { label: 'Contains a number',     test: (p) => /\d/.test(p)            },
  { label: 'Contains a letter',     test: (p) => /[a-zA-Z]/.test(p)      },
]

export default function Register() {
  const [username,  setUsername]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [password2, setPassword2] = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors,    setErrors]    = useState({})

  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()

  const validate = () => {
    const errs = {}
    if (!username)                        errs.username  = 'Username is required'
    if (username.length < 3)              errs.username  = 'Username must be at least 3 characters'
    if (!email)                           errs.email     = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(email))      errs.email     = 'Enter a valid email'
    if (!password)                        errs.password  = 'Password is required'
    if (password.length < 8)              errs.password  = 'Password must be at least 8 characters'
    if (password !== password2)           errs.password2 = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      const res = await register({ username, email, password, password2 })
      const { user, tokens } = res.data
      setAuth(user, tokens.access, tokens.refresh)
      toast.success(`Welcome to DSA Guru, ${user.username}!`)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data || {}
      const errs = {}
      if (data.username) errs.username = data.username[0]
      if (data.email)    errs.email    = data.email[0]
      if (data.password) errs.password = data.password[0]
      if (data.detail)   errs.general  = data.detail
      setErrors(errs)
      toast.error('Registration failed. Please check your details.')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = PASSWORD_RULES.filter(r => r.test(password)).length

  const strengthColor = passwordStrength === 0 ? 'bg-gray-200' :
                        passwordStrength === 1 ? 'bg-red-400'  :
                        passwordStrength === 2 ? 'bg-yellow-400' :
                        'bg-green-400'

  const strengthLabel = passwordStrength === 0 ? '' :
                        passwordStrength === 1 ? 'Weak' :
                        passwordStrength === 2 ? 'Medium' :
                        'Strong'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">

      {/* Background */}
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
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 dark:border-gray-700 p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code2 size={22} className="text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                DSA Guru
              </span>
            </Link>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Create your account
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Start your DSA mastery journey today — it's free!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0  }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Username */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 block">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setErrors({}) }}
                  placeholder="coolcoder123"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.username
                      ? 'border-red-300 focus:ring-red-500/30'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-sky-500/30 focus:border-sky-400'
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

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
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500/30'
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
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm transition-all bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500/30'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-sky-500/30 focus:border-sky-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}

              {/* Password strength */}
              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${(passwordStrength / 3) * 100}%` }}
                        className={`h-full rounded-full transition-all ${strengthColor}`}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${
                      passwordStrength === 3 ? 'text-green-500' :
                      passwordStrength === 2 ? 'text-yellow-500' :
                      'text-red-400'
                    }`}>
                      {strengthLabel}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {PASSWORD_RULES.map((rule, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2
                          size={11}
                          className={rule.test(password) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}
                        />
                        <span className={`text-xs ${
                          rule.test(password)
                            ? 'text-green-500'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password2}
                  onChange={e => { setPassword2(e.target.value); setErrors({}) }}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.password2
                      ? 'border-red-300 focus:ring-red-500/30'
                      : password2 && password === password2
                      ? 'border-green-300 focus:ring-green-500/30'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-sky-500/30 focus:border-sky-400'
                  }`}
                />
                {password2 && password === password2 && (
                  <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              {errors.password2 && (
                <p className="text-xs text-red-500 mt-1">{errors.password2}</p>
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { icon: '🎯', label: 'Interactive Viz'  },
              { icon: '🤖', label: 'AI Assistant'     },
              { icon: '📊', label: 'Track Progress'   },
            ].map((f, i) => (
              <div key={i} className="text-center p-2 bg-gray-50 dark:bg-slate-700 rounded-xl">
                <p className="text-lg">{f.icon}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{f.label}</p>
              </div>
            ))}
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}