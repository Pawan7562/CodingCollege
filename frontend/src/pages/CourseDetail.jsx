import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiPlay, FiUsers, FiClock, FiStar, FiHeart, FiShoppingCart, FiChevronDown, FiChevronUp, FiFileText, FiCheck, FiLock, FiGlobe, FiAward, FiBookOpen } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, addToCart, addToWishlist, isInCart, isInWishlist, isEnrolled } = useAuth()

  const [course, setCourse] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedSection, setExpandedSection] = useState(0)
  const [enrolling, setEnrolling] = useState(false)
  const [myRating, setMyRating] = useState(0)
  const [myComment, setMyComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`)
        setCourse(data.course)
        setReviews(data.reviews)
      } catch {
        toast.error('Course not found')
        navigate('/courses')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    if (user && course) {
      api.get(`/courses/${id}/assignments`).then(({ data }) => setAssignments(data)).catch(() => {})
    }
  }, [id, user, course])

  if (loading) return <Loader fullPage />
  if (!course) return null

  const enrolled = isEnrolled(id)
  const inCart = isInCart(id)
  const inWishlist = isInWishlist(id)
  const discount = course.originalPrice > course.price
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0

  const handleEnroll = async () => {
    if (!user) return navigate('/login')
    if (course.price === 0) {
      setEnrolling(true)
      try {
        await api.post(`/payments/enroll-free/${id}`)
        toast.success('Enrolled successfully!')
        navigate(`/courses/${id}/watch`)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Enrollment failed')
      } finally {
        setEnrolling(false)
      }
    } else {
      addToCart(id)
      navigate('/cart')
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!myRating) return toast.error('Please select a rating')
    setSubmittingReview(true)
    try {
      const { data } = await api.post(`/courses/${id}/reviews`, { rating: myRating, comment: myComment })
      setReviews(prev => [data, ...prev])
      setMyRating(0)
      setMyComment('')
      toast.success('Review submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const tabs = ['overview', 'curriculum', 'reviews', 'assignments']

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="page-container py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Info */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-blue">{course.category}</span>
                <span className="badge badge-purple">{course.level}</span>
                {course.isFeatured && <span className="badge badge-yellow">Featured</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">{course.title}</h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-5">{course.shortDescription || course.description?.substring(0, 150) + '...'}</p>

              <div className="flex flex-wrap items-center gap-5 mb-5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-yellow-400">{(course.ratings || 0).toFixed(1)}</span>
                  <StarRating rating={Math.round(course.ratings || 0)} size="sm" />
                  <span className="text-gray-400 text-sm">({course.numReviews || 0} reviews)</span>
                </div>
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  <FiUsers /> {course.enrolledStudents?.length || 0} students
                </span>
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  <FiBookOpen /> {course.totalLectures || 0} lectures
                </span>
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  <FiGlobe /> {course.language}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Instructor:</span>
                <div className="flex items-center gap-2">
                  {course.instructor?.avatar ? (
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {course.instructor?.name?.charAt(0)}
                    </div>
                  )}
                  <span className="text-blue-400 font-medium">{course.instructor?.name}</span>
                </div>
              </div>
            </div>

            {/* Sticky Sidebar Card */}
            <div className="lg:w-80">
              <div className="card p-5 lg:sticky lg:top-24">
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-lg overflow-hidden mb-5">
                  <img
                    src={course.thumbnail || `https://via.placeholder.com/400x225/1f2937/60a5fa?text=${encodeURIComponent(course.title)}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <FiPlay className="text-white text-2xl ml-1" />
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  {course.price === 0 ? (
                    <span className="text-3xl font-black text-green-400">Free</span>
                  ) : (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-white">${course.price}</span>
                      {discount > 0 && (
                        <>
                          <span className="text-lg text-gray-500 line-through">${course.originalPrice}</span>
                          <span className="badge badge-red text-sm">{discount}% OFF</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {enrolled ? (
                    <Link to={`/courses/${id}/watch`} className="btn-primary w-full justify-center text-base">
                      <FiPlay /> Continue Learning
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="btn-primary w-full justify-center text-base"
                      >
                        {enrolling ? <Loader size="sm" /> : course.price === 0 ? <><FiPlay /> Enroll Free</> : <><FiShoppingCart /> Buy Now</>}
                      </button>
                      {course.price > 0 && (
                        <button
                          onClick={() => { if (!user) navigate('/login'); else addToCart(id) }}
                          disabled={inCart}
                          className="btn-secondary w-full justify-center"
                        >
                          <FiShoppingCart /> {inCart ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => { if (!user) navigate('/login'); else addToWishlist(id) }}
                    className="btn-secondary w-full justify-center"
                  >
                    {inWishlist ? <FaHeart className="text-red-500" /> : <FiHeart />}
                    {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>

                <div className="mt-5 space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2"><FiAward className="text-blue-400" /> Certificate of completion</div>
                  <div className="flex items-center gap-2"><FiClock className="text-blue-400" /> Full lifetime access</div>
                  <div className="flex items-center gap-2"><FiBookOpen className="text-blue-400" /> {course.totalLectures} lectures</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-gray-950 sticky top-16 z-20">
        <div className="page-container">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="max-w-3xl space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">About This Course</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{course.description}</p>
            </div>

            {course.whatYouLearn?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">What You'll Learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.whatYouLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.requirements?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className="text-blue-400 mt-0.5">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.tags?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map(tag => (
                    <Link key={tag} to={`/courses?search=${tag}`} className="badge badge-blue hover:bg-blue-900/70 transition-colors">{tag}</Link>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor */}
            <div className="card p-5">
              <h2 className="text-xl font-bold text-white mb-4">About the Instructor</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                  {course.instructor?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{course.instructor?.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{course.instructor?.bio || 'Expert instructor with years of industry experience.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">Course Curriculum</h2>
              <span className="text-gray-400 text-sm">{course.totalLectures || 0} lectures</span>
            </div>
            {course.lectures?.length === 0 ? (
              <div className="card p-10 text-center">
                <FiBookOpen className="text-gray-600 text-4xl mx-auto mb-3" />
                <p className="text-gray-400">No lectures added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {course.lectures.map((lecture, i) => (
                  <div key={lecture._id} className="card">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">{lecture.title}</p>
                          {lecture.description && <p className="text-xs text-gray-500 truncate">{lecture.description}</p>}
                        </div>
                        {lecture.isFree && <span className="badge badge-green text-xs flex-shrink-0">Free Preview</span>}
                      </div>
                      <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                        {enrolled ? (
                          <Link to={`/courses/${id}/watch?lecture=${lecture._id}`} className="text-blue-400 hover:text-blue-300">
                            <FiPlay size={16} />
                          </Link>
                        ) : lecture.isFree ? (
                          <Link to={`/courses/${id}/watch?lecture=${lecture._id}`} className="text-blue-400 hover:text-blue-300">
                            <FiPlay size={16} />
                          </Link>
                        ) : (
                          <FiLock size={16} className="text-gray-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-6">Student Reviews</h2>

            {/* Rating Summary */}
            <div className="card p-5 mb-6 flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-1">{(course.ratings || 0).toFixed(1)}</div>
                <StarRating rating={Math.round(course.ratings || 0)} size="md" />
                <p className="text-xs text-gray-400 mt-1">Course Rating</p>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 w-4">{star}</span>
                      <FiStar className="text-yellow-400 text-xs" />
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-5 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Write Review */}
            {user && enrolled && (
              <form onSubmit={handleReview} className="card p-5 mb-6">
                <h3 className="font-semibold text-white mb-4">Write a Review</h3>
                <StarRating rating={myRating} onRate={setMyRating} size="lg" />
                <textarea
                  value={myComment}
                  onChange={e => setMyComment(e.target.value)}
                  placeholder="Share your experience with this course..."
                  rows={3}
                  className="input-field mt-3 resize-none"
                />
                <button type="submit" disabled={submittingReview} className="btn-primary mt-3">
                  {submittingReview ? <Loader size="sm" /> : 'Submit Review'}
                </button>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="card p-10 text-center">
                <FiStar className="text-gray-600 text-4xl mx-auto mb-3" />
                <p className="text-gray-400">No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="card p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                        {review.user?.name?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-white text-sm">{review.user?.name}</span>
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs text-gray-500 ml-auto">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-6">Assignments</h2>
            {!user ? (
              <div className="card p-10 text-center">
                <FiLock className="text-gray-600 text-4xl mx-auto mb-3" />
                <p className="text-gray-400 mb-4">Please login to view assignments</p>
                <Link to="/login" className="btn-primary">Login</Link>
              </div>
            ) : !enrolled ? (
              <div className="card p-10 text-center">
                <FiLock className="text-gray-600 text-4xl mx-auto mb-3" />
                <p className="text-gray-400 mb-4">Enroll in this course to access assignments</p>
                <button onClick={handleEnroll} className="btn-primary">Enroll Now</button>
              </div>
            ) : assignments.length === 0 ? (
              <div className="card p-10 text-center">
                <FiFileText className="text-gray-600 text-4xl mx-auto mb-3" />
                <p className="text-gray-400">No assignments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map(a => (
                  <div key={a._id} className="card p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{a.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{a.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="badge badge-blue">{a.maxMarks} marks</span>
                        {a.dueDate && (
                          <p className="text-xs text-gray-500 mt-1">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    {enrolled && (
                      <Link to={`/dashboard?assignment=${a._id}`} className="btn-outline text-sm py-1.5">
                        Submit Assignment
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetail
