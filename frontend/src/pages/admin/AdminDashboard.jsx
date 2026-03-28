import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiBookOpen, FiDollarSign, FiShoppingBag, FiTrendingUp, FiPlus, FiBell } from 'react-icons/fi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import api from '../../api/axios'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  const sendNotification = async () => {
    if (!notification.trim()) return toast.error('Enter a message')
    setSending(true)
    try {
      await api.post('/admin/notifications', { message: notification })
      toast.success('Notification sent to all students')
      setNotification('')
    } catch {
      toast.error('Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  const chartData = stats?.monthlyRevenue?.map(m => ({
    name: MONTHS[m._id.month - 1],
    revenue: m.revenue,
    orders: m.count
  })) || []

  if (loading) return <Loader fullPage />

  const statCards = [
    { title: 'Total Students', value: stats?.totalUsers || 0, icon: FiUsers, color: 'from-blue-600 to-blue-800', change: '+12%' },
    { title: 'Total Courses', value: stats?.totalCourses || 0, icon: FiBookOpen, color: 'from-purple-600 to-purple-800', change: '+5%' },
    { title: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: FiDollarSign, color: 'from-green-600 to-green-800', change: '+18%' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: FiShoppingBag, color: 'from-orange-600 to-orange-800', change: '+8%' },
  ]

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/courses/create" className="btn-primary">
              <FiPlus /> New Course
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map(card => {
            const Icon = card.icon
            return (
              <div key={card.title} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <span className="text-green-400 text-xs font-medium flex items-center gap-1">
                    <FiTrendingUp size={12} /> {card.change}
                  </span>
                </div>
                <div className="text-2xl font-black text-white mb-1">{card.value}</div>
                <div className="text-sm text-gray-400">{card.title}</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 card p-5">
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <FiTrendingUp className="text-blue-400" /> Revenue Overview (6 months)
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb' }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                No revenue data available
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h2 className="font-bold text-white mb-5">Quick Actions</h2>
            <div className="space-y-3 mb-6">
              {[
                { to: '/admin/courses/create', label: 'Create New Course', icon: FiBookOpen, color: 'text-blue-400' },
                { to: '/admin/users', label: 'Manage Users', icon: FiUsers, color: 'text-purple-400' },
                { to: '/admin/courses', label: 'Manage Courses', icon: FiBookOpen, color: 'text-green-400' },
                { to: '/admin/assignments', label: 'Assignments', icon: FiShoppingBag, color: 'text-orange-400' },
                { to: '/admin/teacher-applications', label: 'Teacher Applications', icon: FiUsers, color: 'text-yellow-400' },
              ].map(action => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <Icon className={action.color} size={18} />
                    <span className="text-sm text-gray-300">{action.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Broadcast Notification */}
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FiBell className="text-yellow-400" size={14} /> Broadcast Notification
              </h3>
              <textarea
                value={notification}
                onChange={e => setNotification(e.target.value)}
                placeholder="Message to all students..."
                rows={3}
                className="input-field text-sm resize-none mb-2"
              />
              <button onClick={sendNotification} disabled={sending} className="btn-primary w-full justify-center text-sm">
                {sending ? <Loader size="sm" /> : 'Send to All Students'}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Recent Orders</h2>
            <Link to="/admin" className="text-sm text-blue-400 hover:text-blue-300">View all</Link>
          </div>
          {stats?.recentOrders?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800">
                    <th className="pb-3 font-medium">Student</th>
                    <th className="pb-3 font-medium hidden sm:table-cell">Course</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {stats?.recentOrders?.map(order => (
                    <tr key={order._id} className="hover:bg-gray-900/50 transition-colors">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium text-white">{order.user?.name}</p>
                          <p className="text-gray-500 text-xs">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <p className="text-gray-300 truncate max-w-[150px]">
                          {order.courses?.[0]?.course?.title || 'Multiple courses'}
                        </p>
                      </td>
                      <td className="py-3 pr-4 font-bold text-white">${order.totalAmount?.toFixed(2)}</td>
                      <td className="py-3 pr-4">
                        <span className={`badge ${order.status === 'completed' ? 'badge-green' : order.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 text-xs hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
