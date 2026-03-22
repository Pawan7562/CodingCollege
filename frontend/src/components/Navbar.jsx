import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingCart, FiBell, FiMenu, FiX, FiChevronDown,
  FiUser, FiLogOut, FiGrid, FiBookOpen,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Logo from './Logo'

const Navbar = () => {
  const { user, logout, notifications, unreadCount, markNotificationsRead } = useAuth()
  const { cartCount } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [notifDropdown, setNotifDropdown] = useState(false)
  const navigate = useNavigate()
  const userRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdown(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false) }, [navigate])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const handleLogout = () => {
    logout()
    setUserDropdown(false)
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/85 backdrop-blur-xl border-b border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link to="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
            <Logo size="sm" />
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-400 bg-blue-900/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/70'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'text-purple-400 bg-purple-900/20'
                      : 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/20'
                  }`
                }
              >
                <FiGrid size={13} /> Admin
              </NavLink>
            )}
          </div>

          {/* ── Right side ───────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5">
            {user ? (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Cart"
                >
                  <FiShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] h-[18px] bg-blue-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold px-0.5">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <div ref={notifRef} className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdown(d => !d)
                      if (!notifDropdown) markNotificationsRead()
                    }}
                    className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title="Notifications"
                  >
                    <FiBell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold px-0.5">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
                      >
                        <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                          <h3 className="font-semibold text-sm text-white">Notifications</h3>
                          <span className="text-xs text-gray-500">{notifications.length} total</span>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="text-center py-8">
                              <FiBell className="text-gray-700 text-2xl mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">No notifications yet</p>
                            </div>
                          ) : (
                            [...notifications].reverse().slice(0, 10).map((n, i) => (
                              <div
                                key={i}
                                className={`p-3 border-b border-gray-800/70 last:border-0 ${!n.read ? 'bg-blue-900/10' : ''}`}
                              >
                                {!n.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full float-right mt-1 ml-2 flex-shrink-0" />}
                                <p className="text-sm text-gray-300">{n.message}</p>
                                <p className="text-xs text-gray-600 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User dropdown */}
                <div ref={userRef} className="relative">
                  <button
                    onClick={() => setUserDropdown(d => !d)}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-gray-800/80 transition-colors"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-600/40" />
                    ) : (
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-[11px] font-black text-white ring-2 ring-blue-600/30">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-300 hidden md:block max-w-[90px] truncate">
                      {user.name?.split(' ')[0]}
                    </span>
                    <FiChevronDown
                      size={13}
                      className={`text-gray-500 hidden md:block transition-transform ${userDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
                      >
                        <div className="p-3.5 border-b border-gray-800">
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                          {user.role === 'admin' && (
                            <span className="inline-flex items-center mt-1.5 px-2 py-0.5 bg-purple-900/40 border border-purple-800/50 rounded-full text-[10px] text-purple-300 font-semibold">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setUserDropdown(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                          >
                            <FiUser size={14} /> My Dashboard
                          </Link>
                          <Link
                            to="/cart"
                            onClick={() => setUserDropdown(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                          >
                            <FiShoppingCart size={14} /> My Cart
                          </Link>
                          {user.role === 'teacher' && (
                            <Link
                              to="/teacher/dashboard"
                              onClick={() => setUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-yellow-300 hover:text-yellow-200 hover:bg-yellow-900/20 transition-colors"
                            >
                              <FiGrid size={14} /> Instructor Panel
                            </Link>
                          )}
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-purple-300 hover:text-purple-200 hover:bg-purple-900/20 transition-colors"
                            >
                              <FiGrid size={14} /> Admin Panel
                            </Link>
                          )}
                          <div className="h-px bg-gray-800 mx-3 my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                          >
                            <FiLogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">
                  Sign Up Free
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-gray-950 border-t border-gray-800/60 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'text-blue-400 bg-blue-900/20' : 'text-gray-300 hover:text-white hover:bg-gray-800/70'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {user?.role === 'teacher' && (
                <NavLink
                  to="/teacher/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-yellow-300 hover:bg-yellow-900/20 flex items-center gap-2"
                >
                  <FiGrid size={14} /> Instructor Panel
                </NavLink>
              )}
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-purple-300 hover:bg-purple-900/20 flex items-center gap-2"
                >
                  <FiGrid size={14} /> Admin Panel
                </NavLink>
              )}
              {!user && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800/60">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
