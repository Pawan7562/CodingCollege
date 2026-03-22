import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAward, FiCheckCircle, FiClock, FiXCircle, FiLinkedin, FiGithub, FiYoutube, FiGlobe, FiUser, FiBriefcase, FiMessageSquare, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const BecomeTeacher = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState(null)
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    expertise: '',
    experience: '',
    linkedin: '',
    github: '',
    youtube: '',
    website: '',
    whyTeach: '',
  })

  useEffect(() => {
    if (user?.role === 'teacher') {
      navigate('/teacher/dashboard')
      return
    }
    api.get('/teacher/my-status')
      .then(({ data }) => {
        setStatus(data.teacherApplication?.status || 'none')
        setApplication(data.teacherApplication)
      })
      .catch(() => setStatus('none'))
      .finally(() => setLoading(false))
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.expertise.trim() || !form.experience.trim() || !form.whyTeach.trim()) {
      toast.error('Please fill all required fields')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/teacher/apply', form)
      toast.success('Application submitted! We\'ll review it soon.')
      setStatus('pending')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Pending state
  if (status === 'pending') return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-10 text-center">
          <div className="w-20 h-20 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiClock className="text-yellow-400 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Application Under Review</h1>
          <p className="text-gray-400 mb-6">Your teacher application has been submitted and is being reviewed by our team. We'll notify you once a decision is made.</p>
          <div className="bg-gray-800/50 rounded-xl p-4 text-left mb-6 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Your Application</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Expertise:</span> <span className="text-gray-300">{application?.expertise}</span></div>
              <div><span className="text-gray-500">Experience:</span> <span className="text-gray-300">{application?.experience}</span></div>
              <div className="col-span-2"><span className="text-gray-500">Applied:</span> <span className="text-gray-300">{new Date(application?.appliedAt).toLocaleDateString()}</span></div>
            </div>
          </div>
          <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
        </motion.div>
      </div>
    </div>
  )

  // Rejected state
  if (status === 'rejected') return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-10 text-center">
          <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiXCircle className="text-red-400 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Application Not Approved</h1>
          <p className="text-gray-400 mb-4">Unfortunately, your application was not approved at this time.</p>
          {application?.rejectionReason && (
            <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-red-400 font-semibold mb-1">Reason</p>
              <p className="text-gray-300 text-sm">{application.rejectionReason}</p>
            </div>
          )}
          <p className="text-gray-500 text-sm mb-6">You may reapply after improving your profile and experience.</p>
          <button onClick={() => setStatus('none')} className="btn-primary">Apply Again</button>
        </motion.div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container max-w-4xl">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm font-medium mb-4">
            <FiAward size={14} />
            Become an Instructor
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Share Your Knowledge<br /><span className="text-gradient">with Thousands of Students</span></h1>
          <p className="text-gray-400 max-w-xl mx-auto">Join our community of expert instructors and help students learn valuable skills. Create courses, earn revenue, and build your brand.</p>
        </motion.div>

        {/* Benefits */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '💰', title: 'Earn Revenue', desc: 'Get paid for every student who enrolls in your course' },
            { icon: '🌍', title: 'Global Reach', desc: 'Teach students from around the world on one platform' },
            { icon: '🛠️', title: 'Full Support', desc: 'We provide tools to create, publish, and promote your courses' },
          ].map(b => (
            <div key={b.title} className="card p-5 text-center">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-bold text-white mb-1">{b.title}</h3>
              <p className="text-gray-400 text-sm">{b.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Application Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} className="card p-8">
          <h2 className="text-xl font-bold text-white mb-6">Apply as an Instructor</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Expertise & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label">
                  <FiUser size={13} className="inline mr-1.5 mb-0.5" />
                  Area of Expertise <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.expertise}
                  onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))}
                  className="input-field"
                  placeholder="e.g. Web Development, Python, Data Science"
                />
              </div>
              <div>
                <label className="label">
                  <FiBriefcase size={13} className="inline mr-1.5 mb-0.5" />
                  Years of Experience <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                  className="input-field"
                  placeholder="e.g. 5 years in full-stack development"
                />
              </div>
            </div>

            {/* Why teach */}
            <div>
              <label className="label">
                <FiMessageSquare size={13} className="inline mr-1.5 mb-0.5" />
                Why do you want to teach? <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.whyTeach}
                onChange={e => setForm(f => ({ ...f, whyTeach: e.target.value }))}
                rows={4}
                className="input-field resize-none"
                placeholder="Tell us about your passion for teaching and what makes you a great instructor..."
              />
              <p className="text-xs text-gray-500 mt-1">{form.whyTeach.length}/500 characters</p>
            </div>

            {/* Social Links */}
            <div>
              <p className="label mb-3">Social / Portfolio Links (optional)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <FiLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="url"
                    value={form.linkedin}
                    onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                    className="input-field pl-9"
                    placeholder="LinkedIn profile URL"
                  />
                </div>
                <div className="relative">
                  <FiGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="url"
                    value={form.github}
                    onChange={e => setForm(f => ({ ...f, github: e.target.value }))}
                    className="input-field pl-9"
                    placeholder="GitHub profile URL"
                  />
                </div>
                <div className="relative">
                  <FiYoutube className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="url"
                    value={form.youtube}
                    onChange={e => setForm(f => ({ ...f, youtube: e.target.value }))}
                    className="input-field pl-9"
                    placeholder="YouTube channel URL"
                  />
                </div>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="url"
                    value={form.website}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    className="input-field pl-9"
                    placeholder="Personal website URL"
                  />
                </div>
              </div>
            </div>

            {/* Agreement */}
            <div className="bg-blue-900/10 border border-blue-800/20 rounded-xl p-4 text-sm text-gray-400">
              By applying, you agree to follow our instructor guidelines and create high-quality educational content. Our team will review your application within 3-5 business days.
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base">
              {submitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Submit Application <FiArrowRight />
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default BecomeTeacher
