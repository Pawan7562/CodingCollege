import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [notifications, setNotifications] = useState([])

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    try {
      const { data } = await api.get('/auth/me')
      setUser(data)
      setCart(data.cart || [])
      setWishlist(data.wishlist || [])
      setNotifications(data.notifications || [])
      localStorage.setItem('user', JSON.stringify(data))
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMe() }, [fetchMe])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    await fetchMe()
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    await fetchMe()
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCart([])
    setWishlist([])
    setNotifications([])
    toast.success('Logged out successfully')
  }

  const updateProfile = async (formData) => {
    const { data } = await api.put('/auth/profile', formData)
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  }

  const addToCart = async (courseId) => {
    try {
      const { data } = await api.post(`/auth/cart/${courseId}`)
      setCart(data.cart)
      toast.success('Added to cart')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
      throw err
    }
  }

  const removeFromCart = async (courseId) => {
    try {
      await api.delete(`/auth/cart/${courseId}`)
      setCart(prev => prev.filter(c => (c._id || c) !== courseId))
      toast.success('Removed from cart')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove from cart')
    }
  }

  const addToWishlist = async (courseId) => {
    try {
      const { data } = await api.post(`/auth/wishlist/${courseId}`)
      setWishlist(data.wishlist)
      toast.success(data.message)
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist')
    }
  }

  const markNotificationsRead = async () => {
    try {
      await api.put('/auth/notifications/read')
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch {}
  }

  const isEnrolled = (courseId) => {
    if (!user) return false
    return user.enrolledCourses?.some(c => (c._id || c)?.toString() === courseId?.toString())
  }

  const isInCart = (courseId) => {
    return cart.some(c => (c._id || c)?.toString() === courseId?.toString())
  }

  const isInWishlist = (courseId) => {
    return wishlist.some(c => (c._id || c)?.toString() === courseId?.toString())
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AuthContext.Provider value={{
      user, loading, cart, wishlist, notifications, unreadCount,
      login, register, logout, updateProfile, fetchMe,
      addToCart, removeFromCart, addToWishlist, markNotificationsRead,
      isEnrolled, isInCart, isInWishlist
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
