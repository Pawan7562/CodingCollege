import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

const StarRating = ({ rating = 0, onRate, size = 'md', showCount, count }) => {
  const [hover, setHover] = useState(0)
  const sizes = { sm: 'text-xs', md: 'text-base', lg: 'text-xl' }
  const interactive = !!onRate

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${sizes[size]} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <FaStar
            className={
              star <= (hover || rating)
                ? 'text-yellow-400'
                : 'text-gray-600'
            }
          />
        </button>
      ))}
      {showCount && (
        <span className="text-gray-400 text-sm ml-1">
          ({count || 0})
        </span>
      )}
    </div>
  )
}

export default StarRating
