import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import api from '../api/axios'

const SearchBar = ({ placeholder = 'Search courses...', className = '' }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)
  const debounce = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (debounce.current) clearTimeout(debounce.current)
    if (val.trim().length < 2) { setSuggestions([]); setOpen(false); return }
    debounce.current = setTimeout(async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/courses?search=${val}&limit=5`)
        setSuggestions(data.courses || [])
        setOpen(true)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/courses?search=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  const handleSelect = (course) => {
    navigate(`/courses/${course._id}`)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => suggestions.length && setOpen(true)}
            placeholder={placeholder}
            className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-500 transition-colors"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setSuggestions([]); setOpen(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
              <FiX />
            </button>
          )}
        </div>
        <button type="submit" className="ml-2 btn-primary">Search</button>
      </form>
      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {suggestions.map(course => (
            <button key={course._id} onClick={() => handleSelect(course)} className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors text-left">
              {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-12 h-8 object-cover rounded" />}
              <div>
                <p className="text-sm font-medium text-gray-200 line-clamp-1">{course.title}</p>
                <p className="text-xs text-gray-400">{course.category}</p>
              </div>
              <span className="ml-auto text-sm font-semibold text-blue-400">${course.price}</span>
            </button>
          ))}
          <button onClick={handleSearch} className="w-full p-3 text-sm text-blue-400 hover:bg-gray-800 transition-colors text-center border-t border-gray-800">
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchBar
