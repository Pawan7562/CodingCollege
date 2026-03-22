import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import api from '../api/axios'
import CourseCard from '../components/CourseCard'
import Loader from '../components/Loader'

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Cybersecurity', 'Mobile Dev', 'DevOps', 'Machine Learning', 'Blockchain']
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [dbCategories, setDbCategories] = useState([])

  const category = searchParams.get('category') || 'All'
  const level = searchParams.get('level') || 'All'
  const sort = searchParams.get('sort') || 'newest'
  const search = searchParams.get('search') || ''
  const page = Number(searchParams.get('page')) || 1
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice })

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category !== 'All') params.set('category', category)
      if (level !== 'All') params.set('level', level)
      if (sort) params.set('sort', sort)
      if (page > 1) params.set('page', page)
      if (priceRange.min) params.set('minPrice', priceRange.min)
      if (priceRange.max) params.set('maxPrice', priceRange.max)
      params.set('limit', '12')
      const { data } = await api.get(`/courses?${params.toString()}`)
      setCourses(data.courses)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, category, level, sort, page, priceRange.min, priceRange.max])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  useEffect(() => {
    api.get('/courses/categories').then(({ data }) => setDbCategories(data)).catch(() => {})
  }, [])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'All' || !value) params.delete(key)
    else params.set(key, value)
    params.delete('page')
    setSearchParams(params)
  }

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams)
    if (priceRange.min) params.set('minPrice', priceRange.min)
    else params.delete('minPrice')
    if (priceRange.max) params.set('maxPrice', priceRange.max)
    else params.delete('maxPrice')
    params.delete('page')
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchParams({})
    setPriceRange({ min: '', max: '' })
  }

  const allCategories = ['All', ...new Set([...CATEGORIES.slice(1), ...dbCategories])]
  const hasFilters = category !== 'All' || level !== 'All' || sort !== 'newest' || search || priceRange.min || priceRange.max

  return (
    <div className="min-h-screen pt-20">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            {search ? `Results for "${search}"` : 'All Courses'}
          </h1>
          <p className="text-gray-400">{total} courses available</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="card p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2"><FiFilter size={16} /> Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300">Clear All</button>
                )}
              </div>

              {/* Category */}
              <div className="mb-5">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Category</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {allCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${category === cat ? 'bg-blue-900/50 text-blue-300' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="mb-5">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Level</h4>
                <div className="space-y-1">
                  {LEVELS.map(l => (
                    <button
                      key={l}
                      onClick={() => updateFilter('level', l)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${level === l ? 'bg-blue-900/50 text-blue-300' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Price Range</h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
                    className="w-full input-field text-xs py-1.5 px-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
                    className="w-full input-field text-xs py-1.5 px-2"
                  />
                </div>
                <button onClick={handlePriceFilter} className="w-full btn-primary text-xs py-1.5">Apply</button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort + Mobile Filter Bar */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <button
                onClick={() => setFilterOpen(o => !o)}
                className="lg:hidden flex items-center gap-2 btn-secondary text-sm py-2"
              >
                <FiFilter size={14} /> Filters
                {hasFilters && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-400 hidden sm:block">Sort by:</span>
                <select
                  value={sort}
                  onChange={e => updateFilter('sort', e.target.value)}
                  className="input-field text-sm py-1.5 w-auto pr-8"
                >
                  {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {filterOpen && (
              <div className="lg:hidden card p-4 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}><FiX /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-300 mb-2">Category</h4>
                    <select value={category} onChange={e => updateFilter('category', e.target.value)} className="input-field text-sm py-1.5">
                      {allCategories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-300 mb-2">Level</h4>
                    <select value={level} onChange={e => updateFilter('level', e.target.value)} className="input-field text-sm py-1.5">
                      {LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                {hasFilters && <button onClick={clearFilters} className="mt-3 text-xs text-red-400">Clear All Filters</button>}
              </div>
            )}

            {/* Active Filters */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {search && <span className="badge badge-blue gap-1">Search: {search} <button onClick={() => updateFilter('search', '')}><FiX size={10} /></button></span>}
                {category !== 'All' && <span className="badge badge-blue gap-1">{category} <button onClick={() => updateFilter('category', 'All')}><FiX size={10} /></button></span>}
                {level !== 'All' && <span className="badge badge-purple gap-1">{level} <button onClick={() => updateFilter('level', 'All')}><FiX size={10} /></button></span>}
                {(priceRange.min || priceRange.max) && (
                  <span className="badge badge-green gap-1">
                    ${priceRange.min || 0} - ${priceRange.max || '∞'}
                    <button onClick={() => { setPriceRange({ min: '', max: '' }); handlePriceFilter() }}><FiX size={10} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Courses Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="skeleton aspect-video" />
                    <div className="p-4 space-y-3">
                      <div className="skeleton h-4 rounded w-3/4" />
                      <div className="skeleton h-3 rounded w-1/2" />
                      <div className="skeleton h-3 rounded w-full" />
                      <div className="skeleton h-8 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {courses.map(course => <CourseCard key={course._id} course={course} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      disabled={page <= 1}
                      onClick={() => updateFilter('page', page - 1)}
                      className="btn-secondary text-sm py-2 disabled:opacity-30"
                    >
                      Previous
                    </button>
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => updateFilter('page', i + 1)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={page >= pages}
                      onClick={() => updateFilter('page', page + 1)}
                      className="btn-secondary text-sm py-2 disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses
