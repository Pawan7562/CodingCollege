import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import api from '../api/axios'
import toast from 'react-hot-toast'

const STEPS = ['Account', 'Verify Email', 'Done']

const Register = () => {
  const [step, setStep] = useState(1) // 1=form, 2=email OTP, 3=success
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(0)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Password strength
  const strength = (pw) => {
    let s = 0
    if (pw.length >= 6) s++
    if (pw.length >= 10) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
  }
  const pwStrength = strength(form.password)
  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength]
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][pwStrength]

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // Step 1 – Register
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password })
      setUserId(data.userId)
      setStep(2)
      startResendTimer()
      toast.success('OTP sent to your email!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = Array(6).fill('')
    text.split('').forEach((c, i) => { newOtp[i] = c })
    setOtp(newOtp)
    document.getElementById(`otp-${Math.min(text.length, 5)}`)?.focus()
  }

  // Step 2 – Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) return toast.error('Enter the complete 6-digit OTP')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/verify-email', { userId, otp: code })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setStep(3)
      toast.success('Email verified! Welcome to College! 🎉')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally { setLoading(false) }
  }

  // Resend OTP
  const startResendTimer = () => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0 }
        return t - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    try {
      await api.post('/auth/resend-otp', { userId })
      toast.success('New OTP sent!')
      setOtp(['', '', '', '', '', ''])
      startResendTimer()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-gradient-to-br from-indigo-950 via-blue-950 to-purple-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

        <Link to="/" className="relative z-10 inline-block">
          <Logo size="md" />
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Start building your future today
          </h2>
          <p className="text-blue-200/70 text-lg mb-8">
            Get instant access to 200+ expert courses across Web Dev, Data Science, Design & more.
          </p>
          <div className="space-y-3">
            {[
              'Free account — no credit card needed',
              'Lifetime access to enrolled courses',
              'Certificates of completion',
              'Live doubt-solving sessions',
              'Active community of 50K+ learners',
            ].map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-green-400 text-xs" />
                </div>
                <span className="text-blue-100/80 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/80 text-sm italic mb-3">
            "I went from a BCA student to a ₹22LPA software engineer in 9 months. College's curriculum is unmatched."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">AS</div>
            <div>
              <p className="text-white text-sm font-semibold">Ayesha Siddiqui</p>
              <p className="text-blue-300/70 text-xs">Frontend Engineer @ Meesho</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-block">
              <Logo size="md" />
            </Link>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i + 1 < step ? 'bg-green-500 text-white' :
                  i + 1 === step ? 'bg-blue-600 text-white ring-4 ring-blue-900' :
                  'bg-gray-800 text-gray-500'
                }`}>
                  {i + 1 < step ? <FiCheck /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i + 1 === step ? 'text-white' : 'text-gray-600'}`}>{s}</span>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 w-8 h-px mx-1 ${i + 1 < step ? 'bg-green-500' : 'bg-gray-800'}`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── STEP 1: Registration form ─────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-black text-white mb-1">Create your account</h1>
                  <p className="text-gray-400">Join College and start learning today</p>
                </div>

                {/* OAuth buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => window.location.href = '/api/auth/google'}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-5 rounded-xl transition-all shadow-md active:scale-[0.98]"
                  >
                    <FcGoogle className="text-xl" /> Sign up with Google
                  </button>
                  <button
                    onClick={() => window.location.href = '/api/auth/github'}
                    className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-5 rounded-xl border border-gray-700 transition-all shadow-md active:scale-[0.98]"
                  >
                    <FaGithub className="text-xl" /> Sign up with GitHub
                  </button>
                </div>

                <div className="relative flex items-center mb-6">
                  <div className="flex-1 border-t border-gray-800" />
                  <span className="mx-4 text-xs text-gray-500 bg-gray-950 px-2">OR WITH EMAIL</span>
                  <div className="flex-1 border-t border-gray-800" />
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="John Doe" className="input-field pl-10" autoComplete="name" />
                    </div>
                  </div>

                  <div>
                    <label className="label">Email address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="you@example.com" className="input-field pl-10" autoComplete="email" />
                    </div>
                  </div>

                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                        placeholder="Create a strong password" className="input-field pl-10 pr-11" autoComplete="new-password" />
                      <button type="button" onClick={() => setShowPass(s => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors">
                        {showPass ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {form.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? strengthColor : 'bg-gray-700'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">Strength: <span className="text-gray-200">{strengthLabel}</span></span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="label">Confirm Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                        placeholder="Repeat your password"
                        className={`input-field pl-10 ${form.confirm && form.confirm !== form.password ? 'border-red-600' : form.confirm && form.confirm === form.password ? 'border-green-600' : ''}`}
                        autoComplete="new-password" />
                      {form.confirm && form.confirm === form.password && (
                        <FiCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-400" />
                      )}
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 text-base mt-2 disabled:opacity-60">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating account...
                      </span>
                    ) : <><span>Create Account</span> <FiArrowRight /></>}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-5">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign in</Link>
                </p>
                <p className="text-center text-xs text-gray-600 mt-3">
                  By creating an account you agree to our{' '}
                  <a href="#" className="hover:text-gray-400 transition-colors">Terms</a> &{' '}
                  <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                </p>
              </motion.div>
            )}

            {/* ── STEP 2: Email OTP ─────────────────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
                  <FiArrowLeft /> Back
                </button>

                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-900/30 border border-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMail className="text-blue-400 text-3xl" />
                  </div>
                  <h1 className="text-2xl font-black text-white mb-2">Check your email</h1>
                  <p className="text-gray-400 text-sm">
                    We sent a 6-digit OTP to<br />
                    <span className="text-white font-semibold">{form.email}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">Check spam/junk if you don't see it</p>
                </div>

                <form onSubmit={handleVerifyOTP}>
                  {/* OTP boxes */}
                  <div className="flex justify-center gap-3 mb-6" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-xl font-black bg-gray-800 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white ${
                          digit ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
                        }`}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  <button type="submit" disabled={loading || otp.join('').length < 6}
                    className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Verifying...
                      </span>
                    ) : 'Verify Email'}
                  </button>
                </form>

                <div className="text-center mt-5">
                  <p className="text-gray-500 text-sm">
                    Didn't receive the OTP?{' '}
                    <button
                      onClick={handleResend}
                      disabled={resendTimer > 0}
                      className={`font-semibold transition-colors ${resendTimer > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-blue-400 hover:text-blue-300'}`}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </p>
                </div>

                {/* Dev mode hint */}
                <div className="mt-5 bg-yellow-900/20 border border-yellow-800/40 rounded-xl p-3 text-center">
                  <p className="text-yellow-400/80 text-xs">
                    Dev mode: Check the backend console for the OTP
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Success ───────────────────────────────────────── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-900/40"
                >
                  <FiCheck className="text-white text-4xl" />
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-3">You're all set! 🎉</h2>
                <p className="text-gray-400 mb-6">Your email is verified. Redirecting to your dashboard...</p>
                <div className="flex justify-center">
                  <div className="w-8 h-8">
                    <svg className="animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Register
