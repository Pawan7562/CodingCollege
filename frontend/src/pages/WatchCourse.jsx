import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiMenu, FiX, FiCheck, FiCode, FiFileText, FiInfo, FiDownload } from 'react-icons/fi'
import api from '../api/axios'
import VideoPlayer from '../components/VideoPlayer'
import Loader from '../components/Loader'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const WatchCourse = () => {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState({ completedLectures: [], progressPercentage: 0 })
  const [activeTab, setActiveTab] = useState('notes')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [quizzes, setQuizzes] = useState([])
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const [submittingQuiz, setSubmittingQuiz] = useState(false)

  const lectureId = searchParams.get('lecture')

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: courseData }, { data: progressData }] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/progress`)
        ])
        setCourse(courseData.course)
        setProgress(progressData)
        // Set first lecture if none selected
        if (!lectureId && courseData.course.lectures?.length > 0) {
          setSearchParams({ lecture: courseData.course.lectures[0]._id })
        }
      } catch (err) {
        toast.error('Course not found')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    if (id) {
      api.get(`/courses/${id}/quizzes`).then(({ data }) => setQuizzes(data)).catch(() => {})
    }
  }, [id])

  const activeLecture = course?.lectures?.find(l => l._id === lectureId) || course?.lectures?.[0]
  const lectureIndex = course?.lectures?.findIndex(l => l._id === activeLecture?._id) || 0

  const isCompleted = (lid) => progress.completedLectures?.includes(lid)

  const markComplete = async () => {
    if (!activeLecture) return
    try {
      const { data } = await api.put(`/courses/${id}/progress`, { lectureId: activeLecture._id })
      setProgress(data)
      toast.success('Lecture marked as complete!')
    } catch (err) {
      toast.error('Failed to update progress')
    }
  }

  const goToLecture = (lecture) => {
    setSearchParams({ lecture: lecture._id })
    setQuizResult(null)
    setQuizAnswers({})
  }

  const prevLecture = lectureIndex > 0 ? course?.lectures[lectureIndex - 1] : null
  const nextLecture = course?.lectures && lectureIndex < course.lectures.length - 1 ? course.lectures[lectureIndex + 1] : null

  const submitQuiz = async (quizId) => {
    const answers = Object.values(quizAnswers[quizId] || {})
    if (!answers.length) return toast.error('Please answer all questions')
    setSubmittingQuiz(true)
    try {
      const { data } = await api.post(`/courses/quizzes/${quizId}/submit`, { answers })
      setQuizResult({ quizId, ...data })
      toast.success(`Quiz submitted! Score: ${data.percentage}%`)
    } catch (err) {
      toast.error('Failed to submit quiz')
    } finally {
      setSubmittingQuiz(false)
    }
  }

  if (loading) return <Loader fullPage />
  if (!course) return null

  return (
    <div className="min-h-screen pt-16 flex flex-col bg-gray-950">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <FiChevronLeft size={20} />
          </Link>
          <h1 className="font-semibold text-white text-sm truncate max-w-xs sm:max-w-sm md:max-w-md">{course.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progress.progressPercentage}%` }} />
            </div>
            <span className="text-xs text-gray-400">{progress.progressPercentage}%</span>
          </div>
          <button onClick={() => setSidebarOpen(o => !o)} className="text-gray-400 hover:text-white lg:hidden">
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Video Area */}
        <div className={`flex-1 min-w-0 overflow-y-auto ${sidebarOpen ? '' : 'lg:mr-0'}`}>
          <div className="p-4 lg:p-6">
            {/* Video Player */}
            <VideoPlayer
              url={activeLecture?.videoUrl}
              lectureId={activeLecture?._id}
              onProgress={(state) => {
                if (state.played > 0.9 && activeLecture && !isCompleted(activeLecture._id)) {
                  api.put(`/courses/${id}/progress`, { lectureId: activeLecture._id })
                    .then(({ data }) => setProgress(data))
                    .catch(() => {})
                }
              }}
            />

            {/* Lecture Info */}
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{activeLecture?.title}</h2>
                {activeLecture?.description && (
                  <p className="text-gray-400 mt-1 text-sm">{activeLecture.description}</p>
                )}
              </div>
              {!isCompleted(activeLecture?._id) && (
                <button onClick={markComplete} className="btn-secondary text-sm flex-shrink-0">
                  <FiCheck size={14} /> Mark Complete
                </button>
              )}
              {isCompleted(activeLecture?._id) && (
                <span className="badge badge-green flex items-center gap-1">
                  <FiCheck size={12} /> Completed
                </span>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-800">
              <button
                onClick={() => prevLecture && goToLecture(prevLecture)}
                disabled={!prevLecture}
                className="btn-secondary text-sm disabled:opacity-30"
              >
                <FiChevronLeft /> Previous
              </button>
              <span className="text-sm text-gray-400">{lectureIndex + 1} / {course.lectures?.length}</span>
              <button
                onClick={() => nextLecture && goToLecture(nextLecture)}
                disabled={!nextLecture}
                className="btn-secondary text-sm disabled:opacity-30"
              >
                Next <FiChevronRight />
              </button>
            </div>

            {/* Notes Tabs */}
            <div className="mt-6">
              <div className="flex gap-0 border-b border-gray-800 mb-5">
                {[
                  { id: 'notes', label: 'Notes', icon: FiInfo },
                  { id: 'code', label: 'Code', icon: FiCode },
                  { id: 'pdf', label: 'Resources', icon: FiFileText },
                  { id: 'quiz', label: 'Quiz', icon: FiCheck },
                ].map(t => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === t.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon size={14} /> {t.label}
                    </button>
                  )
                })}
              </div>

              {activeTab === 'notes' && (
                <div className="prose prose-invert max-w-none">
                  {activeLecture?.notes?.explanation ? (
                    <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                      {activeLecture.notes.explanation}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No notes for this lecture.</p>
                  )}
                </div>
              )}

              {activeTab === 'code' && (
                <div>
                  {activeLecture?.notes?.code ? (
                    <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
                      <code className="text-green-400 text-sm">{activeLecture.notes.code}</code>
                    </pre>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No code snippets for this lecture.</p>
                  )}
                </div>
              )}

              {activeTab === 'pdf' && (
                <div>
                  {activeLecture?.notes?.pdf?.length > 0 ? (
                    <div className="space-y-3">
                      {activeLecture.notes.pdf.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-3 card hover:border-gray-600 transition-colors"
                        >
                          <FiFileText className="text-red-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{doc.name}</span>
                          <FiDownload className="text-gray-500 ml-auto" size={14} />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No PDF resources for this lecture.</p>
                  )}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div>
                  {quizzes.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No quizzes available for this course.</p>
                  ) : (
                    <div className="space-y-6">
                      {quizzes.map(quiz => (
                        <div key={quiz._id} className="card p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white">{quiz.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span>{quiz.duration} min</span>
                              <span>{quiz.totalMarks} marks</span>
                            </div>
                          </div>

                          {quizResult?.quizId === quiz._id ? (
                            <div className={`p-4 rounded-lg border ${quizResult.passed ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
                              <h4 className="font-semibold text-white mb-2">
                                {quizResult.passed ? '🎉 Passed!' : '❌ Failed'}
                              </h4>
                              <p className="text-sm text-gray-300">
                                Score: {quizResult.score}/{quizResult.totalMarks} ({quizResult.percentage}%)
                              </p>
                              <button onClick={() => setQuizResult(null)} className="btn-outline text-sm mt-3">Retry</button>
                            </div>
                          ) : (
                            <div className="space-y-5">
                              {quiz.questions.map((q, qi) => (
                                <div key={qi}>
                                  <p className="text-sm font-medium text-gray-200 mb-3">
                                    {qi + 1}. {q.question}
                                  </p>
                                  <div className="space-y-2">
                                    {q.options.map((opt, oi) => (
                                      <label key={oi} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                                        quizAnswers[quiz._id]?.[qi] === oi
                                          ? 'bg-blue-900/30 border border-blue-700'
                                          : 'bg-gray-800 hover:bg-gray-750 border border-transparent'
                                      }`}>
                                        <input
                                          type="radio"
                                          name={`${quiz._id}-${qi}`}
                                          checked={quizAnswers[quiz._id]?.[qi] === oi}
                                          onChange={() => setQuizAnswers(prev => ({
                                            ...prev,
                                            [quiz._id]: { ...(prev[quiz._id] || {}), [qi]: oi }
                                          }))}
                                          className="accent-blue-500"
                                        />
                                        <span className="text-sm text-gray-300">{opt}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => submitQuiz(quiz._id)}
                                disabled={submittingQuiz}
                                className="btn-primary"
                              >
                                {submittingQuiz ? <Loader size="sm" /> : 'Submit Quiz'}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lecture Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 border-l border-gray-800 bg-gray-900 overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white text-sm">Course Content</h3>
              <p className="text-xs text-gray-400 mt-1">
                {progress.completedLectures?.length || 0} / {course.totalLectures} completed
              </p>
            </div>
            <div className="p-2">
              {course.lectures?.map((lecture, i) => {
                const completed = isCompleted(lecture._id)
                const active = lecture._id === activeLecture?._id
                return (
                  <button
                    key={lecture._id}
                    onClick={() => goToLecture(lecture)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors mb-1 ${
                      active ? 'bg-blue-900/30 border border-blue-800/50' : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      completed ? 'bg-green-900/50 text-green-400 border border-green-800' :
                      active ? 'bg-blue-600 text-white' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {completed ? <FiCheck size={10} /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${active ? 'text-blue-300' : 'text-gray-300'}`}>
                        {lecture.title}
                      </p>
                      {lecture.isFree && <span className="text-xs text-green-400">Free</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export default WatchCourse
