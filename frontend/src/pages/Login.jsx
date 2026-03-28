import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  // Show error from OAuth redirect
  const urlError = new URLSearchParams(location.search).get('error')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill all fields')
    setLoading(true)
    try {
      const result = await login(email, password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      const data = err.response?.data
      if (data?.requireEmailVerification) {
        toast('Please verify your email first', { icon: '📧' })
        navigate('/verify-email', { state: { userId: data.userId, email: data.email } })
      } else {
        toast.error(data?.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google'
  }

  const handleGithubLogin = () => {
    window.location.href = '/api/auth/github'
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <Logo size="md" />
          </Link>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-5xl mb-6">🎓</div>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
              Your learning journey starts here
            </h2>
            <p className="text-blue-200/70 text-lg leading-relaxed mb-8">
              Join 50,000+ students mastering the skills that top companies demand.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '200+', label: 'Expert Courses' },
                { value: '50K+', label: 'Active Students' },
                { value: '98%', label: 'Success Rate' },
                { value: '4.9★', label: 'Avg Rating' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur">
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-blue-300/70 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
          </div>
          <p className="text-white/80 text-sm leading-relaxed italic mb-3">
            "College is the best investment I've made. Landed a ₹28 LPA job at a top startup after completing the Full Stack course."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">RK</div>
            <div>
              <p className="text-white text-sm font-semibold">Rohit Kumar</p>
              <p className="text-blue-300/70 text-xs">SDE @ Razorpay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-block">
              <Logo size="md" />
            </Link>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-black text-white mb-1">Welcome back</h1>
            <p className="text-gray-400">Sign in to continue your learning</p>
          </div>

          {/* OAuth error banner */}
          {urlError && (
            <div className="flex items-center gap-3 bg-red-900/30 border border-red-800/50 rounded-xl px-4 py-3 mb-6 text-sm text-red-300">
              <FiAlertCircle className="flex-shrink-0" />
              {urlError === 'google_failed' ? 'Google login failed. Please try again.' : 'GitHub login failed. Please try again.'}
            </div>
          )}

          {/* Social login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <FcGoogle className="text-xl flex-shrink-0" />
              Continue with Google
            </button>
            <button
              onClick={handleGithubLogin}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-5 rounded-xl border border-gray-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <FaGithub className="text-xl flex-shrink-0" />
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center mb-6">
            <div className="flex-1 border-t border-gray-800" />
            <span className="mx-4 text-xs text-gray-500 bg-gray-950 px-2">OR SIGN IN WITH EMAIL</span>
            <div className="flex-1 border-t border-gray-800" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-0.5"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Create one free
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-5 bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">
              Demo admin: <span className="text-gray-300 font-mono">admin@codingcollege.com</span> /{' '}
              <span className="text-gray-300 font-mono">admin123</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
