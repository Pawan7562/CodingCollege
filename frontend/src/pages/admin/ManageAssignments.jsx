import { useState, useEffect } from 'react'
import { FiPlus, FiFileText, FiCheck, FiEye, FiX } from 'react-icons/fi'
import api from '../../api/axios'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', courseId: '', dueDate: '', maxMarks: 100 })
  const [saving, setSaving] = useState(false)
  const [viewAssignment, setViewAssignment] = useState(null)
  const [gradeForm, setGradeForm] = useState({ studentId: '', marks: '', feedback: '', assignmentId: '' })
  const [grading, setGrading] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/admin/assignments'),
      api.get('/admin/courses')
    ]).then(([{ data: asgn }, { data: crs }]) => {
      setAssignments(asgn)
      setCourses(crs)
    }).catch(() => toast.error('Failed to load data'))
    .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.courseId) return toast.error('Fill all required fields')
    setSaving(true)
    try {
      const { data } = await api.post('/admin/assignments', form)
      setAssignments(prev => [data, ...prev])
      setShowForm(false)
      setForm({ title: '', description: '', courseId: '', dueDate: '', maxMarks: 100 })
      toast.success('Assignment created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment')
    } finally {
      setSaving(false)
    }
  }

  const handleGrade = async (e) => {
    e.preventDefault()
    if (!gradeForm.marks) return toast.error('Enter marks')
    setGrading(true)
    try {
      await api.put(`/admin/assignments/${gradeForm.assignmentId}/grade`, {
        studentId: gradeForm.studentId,
        marks: Number(gradeForm.marks),
        feedback: gradeForm.feedback
      })
      toast.success('Assignment graded!')
      setGradeForm({ studentId: '', marks: '', feedback: '', assignmentId: '' })
      // refresh assignment
      const { data } = await api.get('/admin/assignments')
      setAssignments(data)
      setViewAssignment(data.find(a => a._id === gradeForm.assignmentId) || null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to grade')
    } finally {
      setGrading(false)
    }
  }

  if (loading) return <Loader fullPage />

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Assignments</h1>
            <p className="text-gray-400 mt-1">{assignments.length} assignments</p>
          </div>
          <button onClick={() => setShowForm(s => !s)} className="btn-primary">
            <FiPlus /> Create Assignment
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-5">New Assignment</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Assignment title" className="input-field" />
              </div>
              <div>
                <label className="label">Course *</label>
                <select value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))} className="input-field">
                  <option value="">Select a course</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Description *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe the assignment..." className="input-field resize-none" />
              </div>
              <div>
                <label className="label">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="label">Max Marks</label>
                <input type="number" value={form.maxMarks} onChange={e => setForm(f => ({ ...f, maxMarks: e.target.value }))} min="1" className="input-field" />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <Loader size="sm" /> : 'Create Assignment'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignments List */}
          <div className="lg:col-span-2">
            {assignments.length === 0 ? (
              <div className="card p-12 text-center">
                <FiFileText className="text-gray-600 text-5xl mx-auto mb-4" />
                <p className="text-gray-400">No assignments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map(a => (
                  <div key={a._id} className={`card p-5 cursor-pointer transition-all hover:border-gray-600 ${viewAssignment?._id === a._id ? 'border-blue-700' : ''}`} onClick={() => setViewAssignment(viewAssignment?._id === a._id ? null : a)}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{a.title}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{a.course?.title}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="badge badge-blue">{a.maxMarks} marks</span>
                        <span className="badge badge-purple">{a.submissions?.length || 0} submissions</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{a.description}</p>
                    {a.dueDate && (
                      <p className="text-xs text-gray-500 mt-2">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submissions Panel */}
          <div>
            {viewAssignment ? (
              <div className="card p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-white">Submissions</h2>
                  <button onClick={() => setViewAssignment(null)} className="text-gray-400 hover:text-white"><FiX /></button>
                </div>
                <p className="text-sm text-gray-400 mb-4">{viewAssignment.title}</p>

                {viewAssignment.submissions?.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">No submissions yet</p>
                ) : (
                  <div className="space-y-4">
                    {viewAssignment.submissions.map((sub, i) => (
                      <div key={i} className="border border-gray-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-white">
                            {typeof sub.student === 'object' ? sub.student.name : `Student ${i + 1}`}
                          </p>
                          <span className={`badge text-xs ${sub.status === 'graded' ? 'badge-green' : 'badge-yellow'}`}>
                            {sub.status}
                          </span>
                        </div>
                        {sub.answer && (
                          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{sub.answer}</p>
                        )}
                        {sub.status === 'graded' ? (
                          <div className="text-xs text-gray-400">
                            <span className="text-green-400 font-bold">{sub.marks}/{viewAssignment.maxMarks}</span>
                            {sub.feedback && <p className="mt-1">{sub.feedback}</p>}
                          </div>
                        ) : (
                          <div className="mt-2">
                            {gradeForm.studentId === sub.student?.toString() || gradeForm.studentId === sub.student ? (
                              <form onSubmit={handleGrade} className="space-y-2">
                                <input type="hidden" value={gradeForm.assignmentId} />
                                <input
                                  type="number"
                                  value={gradeForm.marks}
                                  onChange={e => setGradeForm(f => ({ ...f, marks: e.target.value }))}
                                  placeholder={`Marks (max ${viewAssignment.maxMarks})`}
                                  max={viewAssignment.maxMarks}
                                  min="0"
                                  className="input-field text-xs py-1.5"
                                />
                                <input
                                  value={gradeForm.feedback}
                                  onChange={e => setGradeForm(f => ({ ...f, feedback: e.target.value }))}
                                  placeholder="Feedback (optional)"
                                  className="input-field text-xs py-1.5"
                                />
                                <div className="flex gap-2">
                                  <button type="submit" disabled={grading} className="btn-primary text-xs py-1.5 px-3">
                                    {grading ? <Loader size="sm" /> : <><FiCheck size={10} /> Grade</>}
                                  </button>
                                  <button type="button" onClick={() => setGradeForm({ studentId: '', marks: '', feedback: '', assignmentId: '' })} className="btn-secondary text-xs py-1.5 px-3">
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                onClick={() => setGradeForm({
                                  studentId: sub.student?.toString() || sub.student,
                                  marks: '',
                                  feedback: '',
                                  assignmentId: viewAssignment._id
                                })}
                                className="btn-outline text-xs py-1 px-2"
                              >
                                Grade
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <FiEye className="text-gray-600 text-3xl mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Click an assignment to view submissions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageAssignments
