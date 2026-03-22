import { useState, useEffect } from 'react'
import { FiSearch, FiTrash2, FiUsers, FiShield } from 'react-icons/fi'
import api from '../../api/axios'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const ManageUsers = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleting, setDeleting] = useState(null)
  const [updatingRole, setUpdatingRole] = useState(null)

  const fetchUsers = async (p = 1, s = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, limit: 20 })
      if (s) params.set('search', s)
      const { data } = await api.get(`/admin/users?${params}`)
      setUsers(data.users)
      setTotal(data.total)
      setPages(data.pages)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers(page, search) }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchUsers(1, search)
  }

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser._id) return toast.error('Cannot change your own role')
    setUpdatingRole(userId)
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole })
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: data.role } : u))
      toast.success(`Role updated to ${newRole}`)
    } catch {
      toast.error('Failed to update role')
    } finally {
      setUpdatingRole(null)
    }
  }

  const handleDelete = async (userId, name) => {
    if (userId === currentUser._id) return toast.error('Cannot delete yourself')
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    setDeleting(userId)
    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(prev => prev.filter(u => u._id !== userId))
      setTotal(t => t - 1)
      toast.success('User deleted')
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Users</h1>
            <p className="text-gray-400 mt-1">{total} total users</p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6 max-w-md">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>

        {loading ? (
          <div className="flex justify-center py-12"><Loader size="lg" /></div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800/50">
                  <tr className="text-left text-gray-400">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Enrolled</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Joined</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-gray-900/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            {user._id === currentUser._id && <span className="text-xs text-blue-400">You</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell text-xs">{user.email}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                        {user.enrolledCourses?.length || 0} courses
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={e => handleRoleChange(user._id, e.target.value)}
                          disabled={user._id === currentUser._id || updatingRole === user._id}
                          className={`bg-transparent border rounded px-2 py-1 text-xs font-medium cursor-pointer transition-colors ${
                            user.role === 'admin'
                              ? 'border-purple-700 text-purple-300'
                              : 'border-gray-700 text-gray-300'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                        </select>
                        {updatingRole === user._id && <Loader size="sm" />}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          disabled={deleting === user._id || user._id === currentUser._id}
                          className="p-1.5 text-red-400 hover:bg-red-900/20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete user"
                        >
                          {deleting === user._id ? <Loader size="sm" /> : <FiTrash2 size={15} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-12">
                  <FiUsers className="text-gray-600 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm py-2 disabled:opacity-30">Previous</button>
            <span className="text-gray-400 text-sm">Page {page} of {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm py-2 disabled:opacity-30">Next</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUsers
