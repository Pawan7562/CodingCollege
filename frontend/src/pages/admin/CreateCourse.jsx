import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiPlus, FiX, FiUpload, FiVideo, FiTrash2 } from 'react-icons/fi'
import api from '../../api/axios'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const CATEGORIES = ['Web Development', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Cybersecurity', 'Mobile Dev', 'DevOps', 'Machine Learning', 'Blockchain', 'Other']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const CreateCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    title: '', description: '', shortDescription: '', price: 0, originalPrice: 0,
    category: 'Web Development', level: 'Beginner', language: 'English',
    tags: [], requirements: [], whatYouLearn: [], isPublished: false, isFeatured: false
  })
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [reqInput, setReqInput] = useState('')
  const [learnInput, setLearnInput] = useState('')
  const [lectures, setLectures] = useState([])
  const [addingLecture, setAddingLecture] = useState(false)
  const [lectureForm, setLectureForm] = useState({ title: '', description: '', videoUrl: '', isFree: false, codeNotes: '', explanationNotes: '' })
  const [lectureVideo, setLectureVideo] = useState(null)
  const [saving, setSaving] = useState(false)
  const [courseId, setCourseId] = useState(id || null)

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/courses/${id}`).then(({ data }) => {
        const c = data.course
        setForm({
          title: c.title, description: c.description, shortDescription: c.shortDescription || '',
          price: c.price, originalPrice: c.originalPrice || 0,
          category: c.category, level: c.level, language: c.language || 'English',
          tags: c.tags || [], requirements: c.requirements || [], whatYouLearn: c.whatYouLearn || [],
          isPublished: c.isPublished, isFeatured: c.isFeatured
        })
        setLectures(c.lectures || [])
        if (c.thumbnail) setThumbnailPreview(c.thumbnail)
        setCourseId(id)
      }).catch(() => toast.error('Course not found'))
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const addItem = (field, value, setter) => {
    if (value.trim()) {
      setForm(f => ({ ...f, [field]: [...f[field], value.trim()] }))
      setter('')
    }
  }

  const removeItem = (field, index) => {
    setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.category) return toast.error('Please fill required fields')
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) formData.append(key, JSON.stringify(value))
        else formData.append(key, value)
      })
      if (thumbnail) formData.append('thumbnail', thumbnail)

      let savedCourse
      if (isEdit && courseId) {
        const { data } = await api.put(`/courses/${courseId}`, formData)
        savedCourse = data
        toast.success('Course updated!')
      } else {
        const { data } = await api.post('/courses', formData)
        savedCourse = data
        setCourseId(data._id)
        toast.success('Course created! Now add lectures.')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course')
    } finally {
      setSaving(false)
    }
  }

  const handleAddLecture = async () => {
    if (!courseId) return toast.error('Save the course first')
    if (!lectureForm.title) return toast.error('Lecture title required')
    setAddingLecture(true)
    try {
      const fd = new FormData()
      Object.entries(lectureForm).forEach(([k, v]) => fd.append(k, v))
      if (lectureVideo) fd.append('video', lectureVideo)
      const { data } = await api.post(`/courses/${courseId}/lectures`, fd)
      setLectures(data.lectures)
      setLectureForm({ title: '', description: '', videoUrl: '', isFree: false, codeNotes: '', explanationNotes: '' })
      setLectureVideo(null)
      toast.success('Lecture added!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lecture')
    } finally {
      setAddingLecture(false)
    }
  }

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm('Delete this lecture?')) return
    try {
      await api.delete(`/courses/${courseId}/lectures/${lectureId}`)
      setLectures(prev => prev.filter(l => l._id !== lectureId))
      toast.success('Lecture deleted')
    } catch {
      toast.error('Failed to delete lecture')
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{isEdit ? 'Edit Course' : 'Create Course'}</h1>
            <p className="text-gray-400 mt-1">{isEdit ? 'Update course details' : 'Add a new course to the platform'}</p>
          </div>
          <button onClick={() => navigate('/admin/courses')} className="btn-secondary text-sm">
            Back to Courses
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-white mb-5">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="label">Course Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Complete React Developer Course" className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Short Description</label>
                <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief 1-line description shown in listings" className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Full Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Detailed course description..." className="input-field resize-none" />
              </div>
              <div>
                <label className="label">Category *</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Level</label>
                <select name="level" value={form.level} onChange={handleChange} className="input-field">
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Price ($) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" className="input-field" />
              </div>
              <div>
                <label className="label">Original Price ($)</label>
                <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} min="0" step="0.01" className="input-field" />
              </div>
              <div>
                <label className="label">Language</label>
                <input name="language" value={form.language} onChange={handleChange} className="input-field" />
              </div>
              <div className="flex items-center gap-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm text-gray-300">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-yellow-500" />
                  <span className="text-sm text-gray-300">Featured</span>
                </label>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-white mb-4">Course Thumbnail</h2>
            <div className="flex items-start gap-5">
              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Thumbnail" className="w-48 h-28 object-cover rounded-lg border border-gray-700" />
              )}
              <label className="flex flex-col items-center justify-center w-48 h-28 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-600 transition-colors">
                <FiUpload className="text-gray-400 text-2xl mb-2" />
                <span className="text-sm text-gray-400">Upload Image</span>
                <span className="text-xs text-gray-600 mt-0.5">800x450 recommended</span>
                <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-white mb-4">Tags</h2>
            <div className="flex gap-2 mb-3">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add a tag" className="input-field flex-1" />
              <button type="button" onClick={addTag} className="btn-secondary px-4">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, i) => (
                <span key={i} className="badge badge-blue gap-1">
                  {tag}
                  <button type="button" onClick={() => removeItem('tags', i)}><FiX size={10} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-white mb-4">What Students Will Learn</h2>
            <div className="flex gap-2 mb-3">
              <input value={learnInput} onChange={e => setLearnInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addItem('whatYouLearn', learnInput, setLearnInput))} placeholder="Add a learning outcome" className="input-field flex-1" />
              <button type="button" onClick={() => addItem('whatYouLearn', learnInput, setLearnInput)} className="btn-secondary px-4">Add</button>
            </div>
            <ul className="space-y-2">
              {form.whatYouLearn.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  <span className="flex-1">{item}</span>
                  <button type="button" onClick={() => removeItem('whatYouLearn', i)} className="text-red-400 hover:text-red-300"><FiX size={14} /></button>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-white mb-4">Requirements</h2>
            <div className="flex gap-2 mb-3">
              <input value={reqInput} onChange={e => setReqInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addItem('requirements', reqInput, setReqInput))} placeholder="Add a requirement" className="input-field flex-1" />
              <button type="button" onClick={() => addItem('requirements', reqInput, setReqInput)} className="btn-secondary px-4">Add</button>
            </div>
            <ul className="space-y-2">
              {form.requirements.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-blue-400">•</span>
                  <span className="flex-1">{item}</span>
                  <button type="button" onClick={() => removeItem('requirements', i)} className="text-red-400 hover:text-red-300"><FiX size={14} /></button>
                </li>
              ))}
            </ul>
          </div>

          {/* Save Button */}
          <button type="submit" disabled={saving} className="btn-primary text-base px-8 py-3">
            {saving ? <Loader size="sm" /> : isEdit ? 'Update Course' : 'Save Course'}
          </button>
        </form>

        {/* Lectures Section */}
        {(courseId || isEdit) && (
          <div className="mt-8 card p-6">
            <h2 className="text-lg font-bold text-white mb-5">Course Lectures</h2>

            {/* Existing Lectures */}
            {lectures.length > 0 && (
              <div className="space-y-3 mb-6">
                {lectures.map((lecture, i) => (
                  <div key={lecture._id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <span className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{lecture.title}</p>
                      {lecture.isFree && <span className="text-xs text-green-400">Free Preview</span>}
                    </div>
                    {lecture.videoUrl && <FiVideo className="text-blue-400 flex-shrink-0" size={14} />}
                    <button onClick={() => handleDeleteLecture(lecture._id)} className="text-red-400 hover:text-red-300 p-1">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Lecture Form */}
            <div className="border-t border-gray-800 pt-5">
              <h3 className="font-semibold text-white mb-4">Add New Lecture</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Lecture Title *</label>
                  <input value={lectureForm.title} onChange={e => setLectureForm(f => ({ ...f, title: e.target.value }))} placeholder="Lecture title" className="input-field" />
                </div>
                <div>
                  <label className="label">Video URL (or upload below)</label>
                  <input value={lectureForm.videoUrl} onChange={e => setLectureForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://..." className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description</label>
                  <input value={lectureForm.description} onChange={e => setLectureForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief lecture description" className="input-field" />
                </div>
                <div>
                  <label className="label">Code Notes</label>
                  <textarea value={lectureForm.codeNotes} onChange={e => setLectureForm(f => ({ ...f, codeNotes: e.target.value }))} rows={3} placeholder="Code examples..." className="input-field resize-none font-mono text-xs" />
                </div>
                <div>
                  <label className="label">Explanation Notes</label>
                  <textarea value={lectureForm.explanationNotes} onChange={e => setLectureForm(f => ({ ...f, explanationNotes: e.target.value }))} rows={3} placeholder="Explanation text..." className="input-field resize-none" />
                </div>
                <div>
                  <label className="label">Upload Video</label>
                  <label className="flex items-center gap-2 cursor-pointer border border-gray-700 rounded-lg px-3 py-2 hover:border-blue-600 transition-colors">
                    <FiUpload className="text-gray-400" />
                    <span className="text-sm text-gray-400">{lectureVideo ? lectureVideo.name : 'Choose video file'}</span>
                    <input type="file" accept="video/*" onChange={e => setLectureVideo(e.target.files[0])} className="hidden" />
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={lectureForm.isFree} onChange={e => setLectureForm(f => ({ ...f, isFree: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                    <span className="text-sm text-gray-300">Free Preview Lecture</span>
                  </label>
                </div>
              </div>
              <button onClick={handleAddLecture} disabled={addingLecture} className="btn-primary mt-4">
                {addingLecture ? <Loader size="sm" /> : <><FiPlus /> Add Lecture</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateCourse
