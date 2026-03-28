import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiSearch, FiStar } from 'react-icons/fi'
import api from '../../api/axios'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const ManageCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [toggling, setToggling] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/admin/courses')
      setCourses(data)
    } catch {
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (courseId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(courseId)
    try {
      await api.delete(`/courses/${courseId}`)
      setCourses(prev => prev.filter(c => c._id !== courseId))
      toast.success('Course deleted')
    } catch {
      toast.error('Failed to delete course')
    } finally {
      setDeleting(null)
    }
  }

  const handleTogglePublish = async (course) => {
    setToggling(course._id)
    try {
      const { data } = await api.put(`/courses/${course._id}`, { isPublished: !course.isPublished })
      setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isPublished: data.isPublished } : c))
      toast.success(data.isPublished ? 'Course published' : 'Course unpublished')
    } catch {
      toast.error('Failed to update course')
    } finally {
      setToggling(null)
    }
  }

  const handleToggleFeatured = async (course) => {
    try {
      const { data } = await api.put(`/courses/${course._id}`, { isFeatured: !course.isFeatured })
      setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isFeatured: data.isFeatured } : c))
      toast.success(data.isFeatured ? 'Marked as featured' : 'Removed from featured')
    } catch {
      toast.error('Failed to update course')
    }
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Loader fullPage />

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Courses</h1>
            <p className="text-gray-400 mt-1">{courses.length} total courses</p>
          </div>
          <Link to="/admin/courses/create" className="btn-primary">
            <FiPlus /> Create Course
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="input-field pl-10"
          />
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/50">
                <tr className="text-left text-gray-400">
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Price</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Students</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Rating</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map(course => (
                  <tr key={course._id} className="hover:bg-gray-900/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail || 'https://via.placeholder.com/60x40/1f2937/60a5fa?text=C'}
                          alt={course.title}
                          className="w-14 h-10 rounded object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate max-w-[200px]">{course.title}</p>
                          <p className="text-xs text-gray-500">{course.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{course.category}</td>
                    <td className="px-4 py-3 font-semibold text-white hidden md:table-cell">
                      {course.price === 0 ? <span className="text-green-400">Free</span> : `$${course.price}`}
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{course.enrolledStudents?.length || 0}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-400 text-xs" />
                        <span className="text-gray-300">{(course.ratings || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`badge text-xs ${course.isPublished ? 'badge-green' : 'badge-yellow'}`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {course.isFeatured && <span className="badge badge-blue text-xs">Featured</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleTogglePublish(course)}
                          disabled={toggling === course._id}
                          title={course.isPublished ? 'Unpublish' : 'Publish'}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        >
                          {course.isPublished ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(course)}
                          title={course.isFeatured ? 'Unfeature' : 'Feature'}
                          className={`p-1.5 rounded transition-colors ${course.isFeatured ? 'text-yellow-400 hover:bg-yellow-900/20' : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'}`}
                        >
                          <FiStar size={15} />
                        </button>
                        <Link
                          to={`/admin/courses/${course._id}/edit`}
                          className="p-1.5 text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
                        >
                          <FiEdit size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id, course.title)}
                          disabled={deleting === course._id}
                          className="p-1.5 text-red-400 hover:bg-red-900/20 rounded transition-colors"
                        >
                          {deleting === course._id ? <Loader size="sm" /> : <FiTrash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {search ? `No courses matching "${search}"` : 'No courses yet'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageCourses
