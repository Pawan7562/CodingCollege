import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiBookOpen, FiAward, FiShoppingBag, FiHeart, FiBell, FiUser, FiEdit, FiPlay, FiFileText, FiCheck, FiClock, FiUpload } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, fetchMe, updateProfile } = useAuth()
  const [tab, setTab] = useState('learning')
  const [orders, setOrders] = useState([])
  const [progresses, setProgresses] = useState({})
  const [assignments, setAssignments] = useState([])
  const [editProfile, setEditProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/payments/my-orders').then(({ data }) => setOrders(data)).catch(() => {})
    if (user?.enrolledCourses) {
      user.enrolledCourses.forEach(async (course) => {
        const cid = course._id || course
        try {
          const { data } = await api.get(`/courses/${cid}/progress`)
          setProgresses(prev => ({ ...prev, [cid]: data }))
        } catch {}
      })
    }
  }, [user])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(profileForm)
      setEditProfile(false)
      toast.success('Profile updated')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'learning', label: 'My Courses', icon: FiBookOpen },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'profile', label: 'Profile', icon: FiUser },
  ]

  const enrolledCourses = user?.enrolledCourses || []
  const wishlist = user?.wishlist || []
  const notifications = user?.notifications || []
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white border-2 border-blue-500">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-gray-400 mt-0.5">
                {enrolledCourses.length} courses enrolled •{' '}
                {user?.role === 'admin' ? '👑 Admin' : user?.role === 'teacher' ? '🎓 Instructor' : '🎓 Student'}
              </p>
            </div>
            <div className="ml-auto hidden sm:flex gap-3">
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn-secondary text-sm">
                  Admin Panel
                </Link>
              )}
              {user?.role === 'teacher' && (
                <Link to="/teacher/dashboard" className="btn-secondary text-sm">
                  Instructor Panel
                </Link>
              )}
              <Link to="/courses" className="btn-primary text-sm">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Enrolled Courses', value: enrolledCourses.length, icon: FiBookOpen, color: 'from-blue-600 to-blue-800' },
            { label: 'Completed', value: Object.values(progresses).filter(p => p.progressPercentage === 100).length, icon: FiAward, color: 'from-green-600 to-green-800' },
            { label: 'Orders', value: orders.length, icon: FiShoppingBag, color: 'from-purple-600 to-purple-800' },
            { label: 'Wishlist', value: wishlist.length, icon: FiHeart, color: 'from-red-600 to-red-800' },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="card p-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="text-white" />
                </div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Become Instructor CTA — only for students */}
        {user?.role === 'student' && !user?.teacherApplication?.status?.match(/pending|approved/) && (
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-800/30 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="text-3xl">🎓</div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Share your knowledge — Become an Instructor</h3>
              <p className="text-gray-400 text-sm mt-0.5">Apply today and start creating courses for thousands of students.</p>
            </div>
            <Link to="/become-teacher" className="btn-primary text-sm flex-shrink-0">Apply Now</Link>
          </div>
        )}
        {user?.teacherApplication?.status === 'pending' && (
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="text-2xl">⏳</div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Teacher Application Under Review</h3>
              <p className="text-gray-400 text-sm mt-0.5">Our team is reviewing your application. You'll be notified once a decision is made.</p>
            </div>
            <span className="badge badge-yellow text-sm flex-shrink-0">Pending</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <aside className="lg:w-52 flex-shrink-0">
            <div className="card overflow-hidden">
              {tabs.map(t => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-800 last:border-0 ${
                      tab === t.id ? 'bg-blue-900/30 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={16} />
                    {t.label}
                    {t.id === 'notifications' && unread > 0 && (
                      <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">{unread}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* My Courses */}
            {tab === 'learning' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-5">My Courses</h2>
                {enrolledCourses.length === 0 ? (
                  <div className="card p-10 text-center">
                    <FiBookOpen className="text-gray-600 text-5xl mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No courses yet</h3>
                    <p className="text-gray-400 mb-5">Start learning by enrolling in a course</p>
                    <Link to="/courses" className="btn-primary">Browse Courses</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.map(course => {
                      const cid = course._id || course
                      const prog = progresses[cid] || { progressPercentage: 0 }
                      return (
                        <div key={cid} className="card p-4 flex items-start gap-4">
                          <img
                            src={course.thumbnail || 'https://via.placeholder.com/80x55/1f2937/60a5fa?text=Course'}
                            alt={course.title}
                            className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm truncate mb-1">
                              {course.title || 'Enrolled Course'}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full transition-all"
                                  style={{ width: `${prog.progressPercentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">{prog.progressPercentage}%</span>
                            </div>
                            {prog.progressPercentage === 100 && (
                              <span className="badge badge-green text-xs mb-2">Completed!</span>
                            )}
                          </div>
                          <Link to={`/courses/${cid}/watch`} className="btn-primary text-xs py-1.5 px-3 flex-shrink-0">
                            <FiPlay size={12} /> {prog.progressPercentage > 0 ? 'Continue' : 'Start'}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {tab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-5">Wishlist</h2>
                {wishlist.length === 0 ? (
                  <div className="card p-10 text-center">
                    <FiHeart className="text-gray-600 text-5xl mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Your wishlist is empty</p>
                    <Link to="/courses" className="btn-primary">Explore Courses</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map(course => {
                      const cid = course._id || course
                      return (
                        <div key={cid} className="card p-4 flex gap-3">
                          <img
                            src={course.thumbnail || 'https://via.placeholder.com/80x55/1f2937/60a5fa?text=Course'}
                            alt={course.title}
                            className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white text-sm truncate">{course.title}</p>
                            <p className="text-blue-400 font-bold mt-1">${course.price || 0}</p>
                          </div>
                          <Link to={`/courses/${cid}`} className="btn-outline text-xs py-1 px-2 self-start">View</Link>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-5">Order History</h2>
                {orders.length === 0 ? (
                  <div className="card p-10 text-center">
                    <FiShoppingBag className="text-gray-600 text-5xl mx-auto mb-4" />
                    <p className="text-gray-400">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order._id} className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Order ID</p>
                            <p className="font-mono text-xs text-gray-300">{order._id?.slice(-8).toUpperCase()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`badge ${order.status === 'completed' ? 'badge-green' : order.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                              {order.status}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-3">
                          {order.courses?.map(({ course }) => (
                            <div key={course?._id} className="flex items-center gap-2">
                              <img
                                src={course?.thumbnail || 'https://via.placeholder.com/40x28/1f2937/60a5fa'}
                                alt={course?.title}
                                className="w-10 h-7 rounded object-cover"
                              />
                              <span className="text-sm text-gray-300">{course?.title || 'Course'}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                          <span className="text-sm text-gray-400 capitalize">{order.paymentMethod}</span>
                          <span className="font-bold text-white">${order.totalAmount?.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            {tab === 'notifications' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-white">Notifications</h2>
                  {unread > 0 && (
                    <span className="badge badge-red">{unread} unread</span>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="card p-10 text-center">
                    <FiBell className="text-gray-600 text-5xl mx-auto mb-4" />
                    <p className="text-gray-400">No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...notifications].reverse().map((n, i) => (
                      <div key={i} className={`card p-4 ${!n.read ? 'border-blue-800/50 bg-blue-900/5' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-gray-700'}`} />
                          <div>
                            <p className="text-sm text-gray-300">{n.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {tab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                  <button onClick={() => setEditProfile(e => !e)} className="btn-secondary text-sm">
                    <FiEdit size={14} /> {editProfile ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="card p-6">
                  <div className="flex items-center gap-5 mb-6">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-blue-500" />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                      <span className={`badge mt-1 ${user?.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {editProfile ? (
                    <form onSubmit={handleProfileSave} className="space-y-4">
                      <div>
                        <label className="label">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="label">Bio</label>
                        <textarea
                          value={profileForm.bio}
                          onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                          rows={3}
                          className="input-field resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <Loader size="sm" /> : 'Save Changes'}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-gray-300 text-sm">{user?.email}</p>
                      </div>
                      {user?.bio && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Bio</p>
                          <p className="text-gray-300 text-sm">{user.bio}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Member since</p>
                        <p className="text-gray-300 text-sm">{new Date(user?.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
