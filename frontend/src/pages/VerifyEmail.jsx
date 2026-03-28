import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Logo from '../components/Logo'
import toast from 'react-hot-toast'

const VerifyEmail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { fetchMe } = useAuth()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)

  const userId = location.state?.userId
  const email = location.state?.email

  useEffect(() => {
    if (!userId) { navigate('/login'); return }
    const interval = setInterval(() => setResendTimer(t => t > 0 ? t - 1 : 0), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = Array(6).fill('')
    text.split('').forEach((c, i) => { newOtp[i] = c })
    setOtp(newOtp)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) return toast.error('Enter the 6-digit OTP')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/verify-email', { userId, otp: code })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      await fetchMe()
      toast.success('Email verified! Welcome to College! 🎉')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    try {
      await api.post('/auth/resend-otp', { userId })
      toast.success('New OTP sent!')
      setResendTimer(60)
      setOtp(['', '', '', '', '', ''])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo size="md" />
          </Link>

          <div className="w-20 h-20 bg-blue-900/30 border border-blue-700/50 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiMail className="text-blue-400 text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Verify your email</h1>
          <p className="text-gray-400 text-sm">
            We sent a 6-digit code to<br />
            <span className="text-white font-semibold">{email}</span>
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
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

            <button
              type="submit"
              disabled={loading || otp.join('').length < 6}
              className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : <><FiCheck /> Verify Email</>}
            </button>
          </form>

          <div className="text-center mt-5 space-y-2">
            <p className="text-gray-500 text-sm">
              Didn't get the code?{' '}
              <button
                onClick={handleResend}
                disabled={resendTimer > 0}
                className={`font-semibold transition-colors ${resendTimer > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-blue-400 hover:text-blue-300'}`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </p>
            <Link to="/login" className="flex items-center justify-center gap-1 text-gray-500 hover:text-gray-300 text-sm transition-colors">
              <FiArrowLeft className="text-xs" /> Back to login
            </Link>
          </div>

          <div className="mt-5 bg-yellow-900/20 border border-yellow-800/40 rounded-xl p-3 text-center">
            <p className="text-yellow-400/80 text-xs">Dev mode: OTP is printed in the backend console</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmail
