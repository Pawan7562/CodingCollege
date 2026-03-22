import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const AuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { fetchMe } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const userRaw = params.get('user')

    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw))
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        fetchMe().then(() => {
          toast.success(`Welcome, ${user.name}! 🎉`)
          navigate('/dashboard', { replace: true })
        })
      } catch {
        toast.error('Login failed. Please try again.')
        navigate('/login', { replace: true })
      }
    } else {
      toast.error('Authentication failed.')
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Completing sign in...</p>
      </div>
    </div>
  )
}

export default AuthCallback
