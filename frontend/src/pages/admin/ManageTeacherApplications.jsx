import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiUser, FiLinkedin, FiGithub, FiYoutube, FiGlobe, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'badge-yellow',
  approved: 'badge-green',
  rejected: 'badge-red',
}

const ManageTeacherApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [selected, setSelected] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/teacher/applications?status=${filter}`)
      setApplications(data)
    } catch {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    setActionLoading(true)
    try {
      await api.put(`/teacher/applications/${id}/approve`)
      toast.success('Teacher approved! They can now create courses.')
      setApplications(a => a.filter(u => u._id !== id))
      setSelected(null)
    } catch {
      toast.error('Failed to approve')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (id) => {
    setActionLoading(true)
    try {
      await api.put(`/teacher/applications/${id}/reject`, { reason: rejectReason })
      toast.success('Application rejected')
      setApplications(a => a.filter(u => u._id !== id))
      setSelected(null)
      setRejectReason('')
    } catch {
      toast.error('Failed to reject')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Teacher Applications</h1>
            <p className="text-gray-400 text-sm mt-1">Review and manage instructor applications</p>
          </div>
          <div className="flex gap-2">
            {['pending', 'approved', 'rejected', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="card p-12 text-center">
            <FiUser className="text-gray-600 text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No {filter} applications</h3>
            <p className="text-gray-400">Check back later for new teacher applications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {applications.map(applicant => (
              <motion.div key={applicant._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  {applicant.avatar ? (
                    <img src={applicant.avatar} alt={applicant.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-700" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                      {applicant.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white truncate">{applicant.name}</h3>
                      <span className={`badge text-xs ${statusColors[applicant.teacherApplication?.status]}`}>
                        {applicant.teacherApplication?.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{applicant.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Applied {new Date(applicant.teacherApplication?.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Application details */}
                <div className="space-y-2 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Expertise</p>
                    <p className="text-sm text-gray-300">{applicant.teacherApplication?.expertise}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Experience</p>
                    <p className="text-sm text-gray-300">{applicant.teacherApplication?.experience}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Why they want to teach</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{applicant.teacherApplication?.whyTeach}</p>
                  </div>
                </div>

                {/* Social links */}
                {(applicant.teacherApplication?.linkedin || applicant.teacherApplication?.github || applicant.teacherApplication?.youtube || applicant.teacherApplication?.website) && (
                  <div className="flex gap-3 mb-4">
                    {applicant.teacherApplication?.linkedin && (
                      <a href={applicant.teacherApplication.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                        <FiLinkedin size={16} />
                      </a>
                    )}
                    {applicant.teacherApplication?.github && (
                      <a href={applicant.teacherApplication.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                        <FiGithub size={16} />
                      </a>
                    )}
                    {applicant.teacherApplication?.youtube && (
                      <a href={applicant.teacherApplication.youtube} target="_blank" rel="noreferrer" className="text-red-400 hover:text-red-300">
                        <FiYoutube size={16} />
                      </a>
                    )}
                    {applicant.teacherApplication?.website && (
                      <a href={applicant.teacherApplication.website} target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300">
                        <FiGlobe size={16} />
                      </a>
                    )}
                  </div>
                )}

                {/* Actions — only for pending */}
                {applicant.teacherApplication?.status === 'pending' && (
                  <>
                    {selected === applicant._id ? (
                      <div className="space-y-2">
                        <textarea
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          rows={2}
                          className="input-field resize-none text-sm"
                          placeholder="Reason for rejection (optional)"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(applicant._id)}
                            disabled={actionLoading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                          >
                            Confirm Reject
                          </button>
                          <button
                            onClick={() => setSelected(null)}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(applicant._id)}
                          disabled={actionLoading}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <FiCheck size={14} /> Approve
                        </button>
                        <button
                          onClick={() => setSelected(applicant._id)}
                          className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm font-medium py-2 rounded-lg border border-red-700/30 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <FiX size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </>
                )}

                {applicant.teacherApplication?.status === 'rejected' && applicant.teacherApplication?.rejectionReason && (
                  <div className="bg-red-900/10 border border-red-800/20 rounded-lg p-3">
                    <p className="text-xs text-red-400 font-medium mb-1">Rejection Reason</p>
                    <p className="text-xs text-gray-400">{applicant.teacherApplication.rejectionReason}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageTeacherApplications
