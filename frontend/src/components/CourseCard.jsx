import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiUsers, FiClock } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import StarRating from './StarRating'

const CourseCard = ({ course }) => {
  const { user, addToCart, addToWishlist, isInCart, isInWishlist, isEnrolled } = useAuth()
  const inCart = isInCart(course._id)
  const inWishlist = isInWishlist(course._id)
  const enrolled = isEnrolled(course._id)

  const levelColors = {
    Beginner: 'badge-green',
    Intermediate: 'badge-yellow',
    Advanced: 'badge-red'
  }

  const handleCart = (e) => {
    e.preventDefault()
    if (!user) { window.location.href = '/login'; return }
    if (!inCart) addToCart(course._id)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    if (!user) { window.location.href = '/login'; return }
    addToWishlist(course._id)
  }

  return (
    <Link to={`/courses/${course._id}`} className="card hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 group block">
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={course.thumbnail || `https://via.placeholder.com/400x225/1f2937/60a5fa?text=${encodeURIComponent(course.title)}`}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {course.isFeatured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
            FEATURED
          </div>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          {inWishlist ? <FaHeart className="text-red-500 text-sm" /> : <FiHeart className="text-gray-300 text-sm" />}
        </button>
        {course.price === 0 && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            FREE
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={levelColors[course.level] || 'badge-blue'}>{course.level}</span>
          <span className="badge badge-blue">{course.category}</span>
        </div>

        <h3 className="font-semibold text-gray-100 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>

        <p className="text-xs text-gray-400 mb-3 line-clamp-1">
          by {course.instructor?.name || 'Instructor'}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={Math.round(course.ratings || 0)} size="sm" />
          <span className="text-yellow-400 text-xs font-medium">{(course.ratings || 0).toFixed(1)}</span>
          <span className="text-gray-500 text-xs">({course.numReviews || 0})</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <FiUsers className="text-gray-500" />
            {course.enrolledStudents?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FiClock className="text-gray-500" />
            {course.totalLectures || 0} lectures
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {course.price === 0 ? (
              <span className="text-lg font-bold text-green-400">Free</span>
            ) : (
              <>
                <span className="text-lg font-bold text-white">${course.price}</span>
                {course.originalPrice > course.price && (
                  <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
                )}
              </>
            )}
          </div>
          {enrolled ? (
            <span className="text-xs text-green-400 font-medium bg-green-900/30 px-2 py-1 rounded-full border border-green-800">
              Enrolled
            </span>
          ) : (
            <button
              onClick={handleCart}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                inCart
                  ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <FiShoppingCart size={12} />
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
