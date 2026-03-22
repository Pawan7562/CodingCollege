import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiBookOpen, FiPlus, FiUsers, FiStar, FiDollarSign,
  FiEdit, FiTrash2, FiEye, FiToggleLeft, FiToggleRight, FiPlay
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('courses')

  useEffect(() => {
    fetchMyCourses()
  }, [])

  const fetchMyCourses = async () => {
    try {
      const { data } = await api.get('/courses?instructor=me')
      // Filter courses created by this teacher
      const myCourses = data.courses?.filter(c => {
        const instructorId = c.instructor?._id || c.instructor
        return instructorId?.toString() === user?._id?.toString()
      }) || []
      setCourses(myCourses)
    } catch {
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return
    try {
      await api.delete(`/courses/${id}`)
      setCourses(c => c.filter(course => course._id !== id))
      toast.success('Course deleted')
    } catch {
      toast.error('Failed to delete course')
    }
  }

  const totalStudents = courses.reduce((a, c) => a + (c.enrolledStudents?.length || 0), 0)
  const totalRevenue = courses.reduce((a, c) => a + ((c.enrolledStudents?.length || 0) * (c.price || 0)), 0)
  const avgRating = courses.length
    ? (courses.reduce((a, c) => a + (c.ratings?.average || 0), 0) / courses.length).toFixed(1)
    : '0.0'

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-800/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-purple-500" />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white border-2 border-purple-500">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">Instructor Dashboard</h1>
              <p className="text-gray-400 mt-0.5">Welcome back, {user?.name?.split(' ')[0]}!</p>
              <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                ✦ Verified Instructor
              </span>
            </div>
            <div className="ml-auto">
              <Link to="/admin/courses/create" className="btn-primary">
                <FiPlus size={16} /> New Course
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'My Courses', value: courses.length, icon: FiBookOpen, color: 'from-blue-600 to-blue-800' },
            { label: 'Total Students', value: totalStudents, icon: FiUsers, color: 'from-purple-600 to-purple-800' },
            { label: 'Avg Rating', value: avgRating, icon: FiStar, color: 'from-yellow-600 to-yellow-800' },
            { label: 'Est. Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: FiDollarSign, color: 'from-green-600 to-green-800' },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="text-white" size={18} />
                </div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Courses List */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">My Courses</h2>
            <Link to="/admin/courses/create" className="btn-primary text-sm">
              <FiPlus size={14} /> Create New
            </Link>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center">
              <FiBookOpen className="text-gray-600 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No courses yet</h3>
              <p className="text-gray-400 mb-5">Create your first course and start teaching!</p>
              <Link to="/admin/courses/create" className="btn-primary">
                <FiPlus size={15} /> Create First Course
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {courses.map(course => (
                <motion.div key={course._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-800/30 transition-colors"
                >
                  <img
                    src={course.thumbnail || 'https://via.placeholder.com/80x55/1f2937/60a5fa?text=Course'}
                    alt={course.title}
                    className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm truncate">{course.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><FiUsers size={11} />{course.enrolledStudents?.length || 0} students</span>
                      <span className="flex items-center gap-1"><FiPlay size={11} />{course.lectures?.length || 0} lectures</span>
                      <span className="flex items-center gap-1"><FiStar size={11} />{course.ratings?.average?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge text-xs ${course.isPublished ? 'badge-green' : 'badge-yellow'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-white font-bold text-sm">${course.price}</span>
                    <Link to={`/admin/courses/${course._id}/edit`} className="btn-secondary text-xs py-1 px-2">
                      <FiEdit size={12} />
                    </Link>
                    <button onClick={() => handleDelete(course._id)} className="btn-secondary text-xs py-1 px-2 text-red-400 hover:text-red-300">
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
