import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowRight, FiPlay, FiStar, FiUsers, FiBookOpen, FiAward,
  FiCode, FiDatabase, FiLayout, FiTrendingUp, FiShield, FiSmartphone,
  FiCheck, FiYoutube, FiLinkedin, FiGithub, FiTwitter, FiMail,
  FiZap, FiGlobe, FiMessageCircle, FiX,
} from 'react-icons/fi'
import api from '../api/axios'
import CourseCard from '../components/CourseCard'
import SearchBar from '../components/SearchBar'

// ── Change this to your YouTube video ID (the part after ?v=) ──────────────────
const DEMO_VIDEO_ID = 'efPlVC2lYU0'

const categories = [
  { name: 'Web Development', icon: FiCode, color: 'from-blue-600 to-cyan-500', bg: 'bg-blue-900/20 border-blue-800/40', courses: 45 },
  { name: 'Data Science', icon: FiDatabase, color: 'from-purple-600 to-pink-500', bg: 'bg-purple-900/20 border-purple-800/40', courses: 32 },
  { name: 'UI/UX Design', icon: FiLayout, color: 'from-orange-500 to-yellow-500', bg: 'bg-orange-900/20 border-orange-800/40', courses: 28 },
  { name: 'Digital Marketing', icon: FiTrendingUp, color: 'from-green-500 to-teal-500', bg: 'bg-green-900/20 border-green-800/40', courses: 21 },
  { name: 'Cybersecurity', icon: FiShield, color: 'from-red-500 to-rose-500', bg: 'bg-red-900/20 border-red-800/40', courses: 18 },
  { name: 'Mobile Dev', icon: FiSmartphone, color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-900/20 border-indigo-800/40', courses: 24 },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'Frontend Developer @ Google', avatar: 'PS', color: 'from-pink-500 to-rose-500', text: 'CodingCollege completely changed my career. The courses are world-class and the assignments really push you to grow. I went from zero to a Google SDE in 8 months!', rating: 5 },
  { name: 'Arjun Mehta', role: 'Data Scientist @ Amazon', avatar: 'AM', color: 'from-blue-500 to-cyan-500', text: 'The Data Science bootcamp is absolutely top-notch. Real projects, expert mentorship, and a community that keeps you motivated. Worth every rupee!', rating: 5 },
  { name: 'Sarah Chen', role: 'UX Lead @ Flipkart', avatar: 'SC', color: 'from-purple-500 to-violet-500', text: 'The UI/UX courses here are unmatched. The video quality, notes, and quizzes make learning so effective. I built a stunning portfolio and got my dream job.', rating: 5 },
]

const steps = [
  { step: '01', icon: FiBookOpen, title: 'Browse & Choose', desc: 'Explore 200+ expert-curated courses across Web Dev, Data Science, Design and more.' },
  { step: '02', icon: FiPlay, title: 'Learn at Your Pace', desc: 'Watch HD video lectures, download notes, solve assignments, and take quizzes anytime.' },
  { step: '03', icon: FiAward, title: 'Get Certified', desc: 'Earn industry-recognized certificates and showcase your skills to top employers.' },
]

// ─── Animated Code Lines ───────────────────────────────────────────────────────
const codeLines = [
  { tokens: [{ t: 'import ', c: 'text-purple-400' }, { t: 'React', c: 'text-blue-300' }, { t: ' from ', c: 'text-purple-400' }, { t: "'react'", c: 'text-green-400' }] },
  { tokens: [] },
  { tokens: [{ t: 'const ', c: 'text-purple-400' }, { t: 'App', c: 'text-yellow-300' }, { t: ' = () => {', c: 'text-gray-300' }] },
  { tokens: [{ t: '  const ', c: 'text-purple-400' }, { t: '[data, setData]', c: 'text-blue-300' }, { t: ' = useState(', c: 'text-gray-300' }, { t: '[]', c: 'text-orange-300' }, { t: ')', c: 'text-gray-300' }] },
  { tokens: [] },
  { tokens: [{ t: '  useEffect', c: 'text-yellow-300' }, { t: '(() => {', c: 'text-gray-300' }] },
  { tokens: [{ t: '    fetch', c: 'text-yellow-300' }, { t: '(', c: 'text-gray-300' }, { t: "'/api/courses'", c: 'text-green-400' }, { t: ')', c: 'text-gray-300' }] },
  { tokens: [{ t: '      .then', c: 'text-yellow-300' }, { t: '(res => res.', c: 'text-gray-300' }, { t: 'json', c: 'text-yellow-300' }, { t: '())', c: 'text-gray-300' }] },
  { tokens: [{ t: '      .then', c: 'text-yellow-300' }, { t: '(', c: 'text-gray-300' }, { t: 'setData', c: 'text-blue-300' }, { t: ')', c: 'text-gray-300' }] },
  { tokens: [{ t: '  }, [])', c: 'text-gray-300' }] },
  { tokens: [] },
  { tokens: [{ t: '  return ', c: 'text-purple-400' }, { t: '(', c: 'text-gray-300' }] },
  { tokens: [{ t: '    <div ', c: 'text-blue-400' }, { t: 'className', c: 'text-green-300' }, { t: '=', c: 'text-gray-300' }, { t: '"course-grid"', c: 'text-orange-300' }, { t: '>', c: 'text-blue-400' }] },
  { tokens: [{ t: '      {data.', c: 'text-gray-300' }, { t: 'map', c: 'text-yellow-300' }, { t: '(course => (', c: 'text-gray-300' }] },
  { tokens: [{ t: '        <CourseCard ', c: 'text-blue-400' }, { t: 'key', c: 'text-green-300' }, { t: '={course.id} />', c: 'text-blue-400' }] },
  { tokens: [{ t: '      ))}', c: 'text-gray-300' }] },
  { tokens: [{ t: '    </div>', c: 'text-blue-400' }] },
  { tokens: [{ t: '  )', c: 'text-gray-300' }] },
  { tokens: [{ t: '}', c: 'text-gray-300' }] },
]

// ─── Hero Right Visual ─────────────────────────────────────────────────────────
const HeroVisual = () => {
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Animate code lines appearing
  useEffect(() => {
    if (!isPlaying) return
    if (visibleLines >= codeLines.length) return
    const t = setTimeout(() => setVisibleLines(v => v + 1), 180)
    return () => clearTimeout(t)
  }, [visibleLines, isPlaying])

  // Reset and loop
  useEffect(() => {
    if (visibleLines >= codeLines.length) {
      const t = setTimeout(() => setVisibleLines(0), 2500)
      return () => clearTimeout(t)
    }
  }, [visibleLines])

  // Animate progress bar
  useEffect(() => {
    const t = setInterval(() => setProgress(p => p >= 100 ? 0 : p + 0.4), 80)
    return () => clearInterval(t)
  }, [])

  const currentTime = `${String(Math.floor((progress / 100) * 22)).padStart(2, '0')}:${String(Math.floor(((progress / 100) * 22 * 60) % 60)).padStart(2, '0')}`

  return (
    <div className="relative w-full max-w-[470px] mx-auto">
      {/* Multi-layer glow */}
      <div className="absolute -inset-6 bg-blue-600/8 blur-3xl rounded-3xl" />
      <div className="absolute -inset-2 bg-purple-600/5 blur-2xl rounded-3xl" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/40 border border-gray-700/80"
        style={{ background: 'linear-gradient(145deg, #111827 0%, #0f172a 100%)' }}
      >
        {/* ── Top bar: Browser chrome ── */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/90 border-b border-gray-700/60 backdrop-blur">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 mx-2 bg-gray-700/60 rounded-md px-3 py-1 text-xs text-gray-400 text-center font-mono tracking-wide">
            codingcollege.in/watch/fullstack
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            <span className="text-red-400 font-medium text-xs">LIVE</span>
          </div>
        </div>

        {/* ── Video player area ── */}
        <div className="relative overflow-hidden" style={{ height: '220px' }}>
          {/* Animated gradient background */}
          <motion.div
            animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #0c1a3a 0%, #0f0c29 25%, #1a0533 50%, #0c1a3a 75%, #0f0c29 100%)',
              backgroundSize: '400% 400%',
            }}
          />

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          {/* Animated code in video */}
          <div className="absolute inset-0 flex items-start justify-start overflow-hidden">
            <div className="absolute inset-0 bg-[#0d1117]/85" />
            <div className="relative z-10 p-4 w-full font-mono text-[10.5px] leading-[1.7] overflow-hidden" style={{ height: '220px' }}>
              {/* Line numbers + code */}
              {codeLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex gap-3"
                >
                  <span className="text-gray-600 select-none w-4 text-right flex-shrink-0">{i + 1}</span>
                  <span>
                    {line.tokens.length === 0 ? '\u00A0' : line.tokens.map((tok, j) => (
                      <span key={j} className={tok.c}>{tok.t}</span>
                    ))}
                    {/* Blinking cursor on last line */}
                    {i === visibleLines - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-[2px] h-[13px] bg-blue-400 ml-0.5 align-middle"
                      />
                    )}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Course title overlay — top left */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">REACT + NODE</div>
              <div className="bg-gray-800/80 backdrop-blur text-gray-300 text-[10px] px-2 py-0.5 rounded-md border border-gray-700/60">
                Lecture 7 / 42
              </div>
            </div>
            <div className="bg-gray-900/80 backdrop-blur border border-gray-700/60 rounded-md px-2 py-0.5 text-[10px] text-gray-400 font-mono">
              HD 1080p
            </div>
          </div>

          {/* Play/Pause overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(p => !p)}
              className="w-14 h-14 bg-blue-600/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl shadow-blue-900/60"
            >
              {isPlaying
                ? <div className="flex gap-1"><div className="w-1.5 h-5 bg-white rounded-sm" /><div className="w-1.5 h-5 bg-white rounded-sm" /></div>
                : <FiPlay className="text-white text-xl ml-1" />
              }
            </motion.button>
          </div>
        </div>

        {/* ── Video controls bar ── */}
        <div className="px-4 pt-2.5 pb-2 bg-gray-900/95 border-t border-gray-800/60">
          {/* Course title */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white text-sm font-bold leading-tight">Full Stack Web Development</p>
              <p className="text-gray-500 text-xs mt-0.5">Building a REST API with Node.js &amp; Express</p>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0 ml-3">
              <FiStar size={11} className="fill-yellow-400" />
              <span className="text-xs font-bold">4.9</span>
            </div>
          </div>

          {/* Progress bar with thumb */}
          <div className="relative h-1 bg-gray-700 rounded-full overflow-hidden mb-2 cursor-pointer group">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(p => !p)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {isPlaying
                  ? <div className="flex gap-0.5"><div className="w-1 h-3.5 bg-current rounded-sm" /><div className="w-1 h-3.5 bg-current rounded-sm" /></div>
                  : <FiPlay size={13} />
                }
              </button>
              <span className="text-gray-500 text-[11px] font-mono">{currentTime} / 22:47</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-[10px]">1x</span>
              <div className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">CC</div>
              <FiMaximize size={11} className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* ── Lecture list ── */}
        <div className="px-4 pb-4 bg-gray-900/95 space-y-1.5 border-t border-gray-800/40 pt-3">
          {[
            { title: 'Intro to Node.js & Express',  dur: '14:20', done: true },
            { title: 'REST API Design Principles',   dur: '18:45', done: true },
            { title: 'Building CRUD with MongoDB',   dur: '22:47', done: false, active: true },
            { title: 'Authentication with JWT',      dur: '31:10', done: false },
          ].map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                l.active ? 'bg-blue-900/35 border border-blue-700/40' : 'hover:bg-gray-800/60'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] transition-all ${
                l.done ? 'bg-green-500/20 border border-green-500/40' :
                l.active ? 'bg-blue-500/20 border border-blue-500/50' :
                'bg-gray-800 border border-gray-700'
              }`}>
                {l.done
                  ? <FiCheck className="text-green-400" size={10} />
                  : <FiPlay className={`ml-0.5 ${l.active ? 'text-blue-400' : 'text-gray-600'}`} size={9} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[11px] leading-tight block truncate ${
                  l.active ? 'text-white font-semibold' : l.done ? 'text-gray-500 line-through' : 'text-gray-400'
                }`}>{l.title}</span>
              </div>
              <span className="text-[10px] text-gray-600 font-mono flex-shrink-0">{l.dur}</span>
              {l.active && (
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Floating: Certificate badge ── */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6, ease: 'backOut' }}
        className="absolute -top-5 -right-5 bg-gradient-to-br from-yellow-400 to-orange-500 text-black rounded-2xl px-3.5 py-2.5 shadow-2xl shadow-orange-900/40 text-xs font-black flex items-center gap-2"
      >
        <FiAward size={15} /> Certificate Earned!
      </motion.div>

      {/* ── Floating: Students online ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.6, ease: 'backOut' }}
        className="absolute -bottom-5 -left-5 bg-gray-800/95 border border-gray-700 rounded-2xl px-3.5 py-2.5 shadow-2xl backdrop-blur"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-2">
            {[
              { bg: 'from-blue-500 to-blue-600', l: 'A' },
              { bg: 'from-purple-500 to-purple-600', l: 'S' },
              { bg: 'from-pink-500 to-rose-500', l: 'R' },
              { bg: 'from-green-500 to-emerald-500', l: 'K' },
            ].map((a, i) => (
              <div key={i} className={`w-7 h-7 bg-gradient-to-br ${a.bg} rounded-full border-2 border-gray-800 text-white text-[10px] font-black flex items-center justify-center`}>
                {a.l}
              </div>
            ))}
          </div>
          <div>
            <p className="text-white text-xs font-bold">50K+ Students</p>
            <div className="flex items-center gap-1 mt-0.5">
              {[...Array(5)].map((_, i) => <FiStar key={i} size={9} className="text-yellow-400 fill-yellow-400" />)}
              <span className="text-yellow-400 text-[10px] font-bold ml-0.5">4.9</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Floating: Live now ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute top-20 -left-7 bg-gray-800/95 border border-gray-700 rounded-xl px-3 py-2 shadow-xl backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <div className="relative w-2.5 h-2.5">
            <div className="absolute inset-0 bg-green-400 rounded-full" />
            <motion.div animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="absolute inset-0 bg-green-400 rounded-full"
            />
          </div>
          <span className="text-white text-xs font-semibold">1,247 Online Now</span>
        </div>
      </motion.div>

      {/* ── Floating: Progress ring ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.7, duration: 0.5, ease: 'backOut' }}
        className="absolute top-4 -right-7 bg-gray-800/95 border border-gray-700 rounded-xl p-2.5 shadow-xl backdrop-blur"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#1f2937" strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="14" fill="none"
                stroke="url(#prog)" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="88"
                initial={{ strokeDashoffset: 88 }}
                animate={{ strokeDashoffset: 88 * (1 - 0.65) }}
                transition={{ duration: 1.5, delay: 1.8 }}
              />
              <defs>
                <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-[10px] font-black">65%</span>
            </div>
          </div>
          <span className="text-gray-500 text-[9px] mt-1 font-medium">Progress</span>
        </div>
      </motion.div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
const FiMaximize = ({ size, className }) => (
  <svg width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
)

// ─── Video Demo Section ────────────────────────────────────────────────────────
const VideoSection = () => {
  const [playing, setPlaying] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const highlights = [
    { icon: FiPlay,     label: 'HD Video Lectures',       desc: '1080p quality, offline download' },
    { icon: FiCode,     label: 'Live Code Playground',    desc: 'Code right inside the browser' },
    { icon: FiAward,    label: 'Instant Certificates',    desc: 'Auto-generated on completion' },
    { icon: FiUsers,    label: 'Community Forums',        desc: 'Ask doubts, get answers fast' },
  ]

  return (
    <section id="demo-video" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-blue-950/10 to-gray-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-600/40 to-transparent" />

      <div className="page-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-4">
            <FiPlay size={13} /> Platform Preview
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            See How Learning<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Feels on CodingCollege
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Watch a quick tour of the platform — video player, code labs, assignments, and certificates — all in one place.
          </p>
        </motion.div>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto mb-14"
        >
          {/* Glow */}
          <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-3xl" />

          {/* Player wrapper */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl shadow-blue-900/30 bg-gray-900">
            {/* Top bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-800/80 border-b border-gray-700 backdrop-blur">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="flex-1 ml-3 bg-gray-700/60 rounded-full px-3 py-1 text-xs text-gray-400 text-center">
                codingcollege.in/courses/fullstack
              </div>
            </div>

            {/* Video area */}
            <div className="relative aspect-video bg-gray-950">
              {playing ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                  title="CodingCollege Platform Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {/* Thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${DEMO_VIDEO_ID}/maxresdefault.jpg`}
                    alt="Platform Demo"
                    className="w-full h-full object-cover opacity-60"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent" />

                  {/* Fake progress bar at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-white text-xs font-mono">0:00</span>
                      <div className="flex-1 h-1 bg-gray-700/80 rounded-full overflow-hidden">
                        <div className="h-full w-0 bg-blue-500 rounded-full" />
                      </div>
                      <span className="text-white text-xs font-mono">12:47</span>
                    </div>
                  </div>

                  {/* Play button */}
                  <button
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/60 transition-colors"
                    >
                      <FiPlay className="text-white text-3xl ml-1" />
                    </motion.div>
                    <div className="bg-black/60 backdrop-blur rounded-xl px-5 py-2 text-center">
                      <p className="text-white font-semibold text-sm">Watch Full Platform Demo</p>
                      <p className="text-gray-400 text-xs mt-0.5">12 min · No sign-up required</p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Expand to modal button */}
          <button
            onClick={() => setModalOpen(true)}
            className="absolute top-14 right-3 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 backdrop-blur transition-colors"
          >
            ⛶ Fullscreen
          </button>
        </motion.div>

        {/* Highlights grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {highlights.map((h, i) => {
            const Icon = h.icon
            return (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-blue-800/60 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-900/30 border border-blue-800/40 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-900/50 transition-colors">
                  <Icon className="text-blue-400" size={18} />
                </div>
                <p className="text-white text-sm font-semibold mb-1">{h.label}</p>
                <p className="text-gray-500 text-xs">{h.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute -top-10 right-0 text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
              >
                <FiX /> Close
              </button>
              <div className="aspect-video rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                  title="CodingCollege Platform Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── Co-Founder Section ────────────────────────────────────────────────────────
const CoFounderSection = () => (
  <section className="py-24 relative overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-gray-950 to-purple-950/50" />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-600/50 to-transparent" />

    <div className="page-container relative z-10">
      {/* Section label */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-800/50 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-4">
          <FiUsers /> Meet Your Instructor
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white">
          Learn from the
          <span className="gradient-text"> Best</span>
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left – Profile Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-shrink-0 flex flex-col items-center"
        >
          {/* Image frame */}
          <div className="relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 scale-105 opacity-60 blur-sm" />
            <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-1 shadow-2xl shadow-blue-900/50">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src="/Founder.jpeg"
                  alt="Pawan Kumar — Founder & Lead Instructor"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            {/* Verified badge */}
            <div className="absolute bottom-3 right-3 w-12 h-12 bg-blue-600 rounded-full border-4 border-gray-950 flex items-center justify-center shadow-lg">
              <FiCheck className="text-white text-lg font-bold" />
            </div>
          </div>

          {/* Quick stats below photo */}
          <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
            {[
              { value: '12+', label: 'Courses' },
              { value: '50K+', label: 'Students' },
              { value: '4.9★', label: 'Rating' },
            ].map(s => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                <p className="text-white font-black text-lg">{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="mt-5 flex items-center gap-3">
            {[
              { icon: FiYoutube, color: 'hover:text-red-500', href: '#' },
              { icon: FiLinkedin, color: 'hover:text-blue-400', href: '#' },
              { icon: FiGithub, color: 'hover:text-gray-300', href: '#' },
              { icon: FiTwitter, color: 'hover:text-sky-400', href: '#' },
              { icon: FiMail, color: 'hover:text-green-400', href: '#' },
            ].map(({ icon: Icon, color, href }, i) => (
              <a key={i} href={href} className={`w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 ${color} transition-all hover:border-gray-500 hover:-translate-y-0.5`}>
                <Icon className="text-base" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right – Bio & Details */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex-1 max-w-2xl"
        >
          {/* Name & title */}
          <div className="mb-6">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-2">Founder & Lead Instructor</p>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-3">Pawan Kumar</h3>
            <p className="text-gray-400 text-lg">Full Stack Developer · Educator · Tech Entrepreneur</p>
          </div>

          {/* Quote */}
          <blockquote className="relative bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl px-6 py-4 mb-6">
            <p className="text-gray-200 text-lg italic leading-relaxed">
              "My mission is to make world-class tech education accessible to every student in India and beyond. Code is the superpower of the 21st century — and I want to give it to you."
            </p>
          </blockquote>

          {/* Bio */}
          <p className="text-gray-400 leading-relaxed mb-6">
            With over <span className="text-white font-semibold">8+ years of industry experience</span> at top tech companies, I've built production apps used by millions. I founded <span className="text-blue-400 font-semibold">CodingCollege</span> with one goal: to bridge the gap between academic learning and real-world development. My courses focus on practical, job-ready skills — not just theory.
          </p>

          {/* Expertise tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['React.js', 'Node.js', 'MongoDB', 'TypeScript', 'System Design', 'DSA', 'DevOps', 'AWS'].map(tag => (
              <span key={tag} className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-full font-medium hover:border-blue-600 hover:text-blue-300 transition-colors">
                {tag}
              </span>
            ))}
          </div>

          {/* Achievement cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: FiYoutube, label: 'YouTube Channel', value: '500K+ Subscribers', color: 'text-red-400' },
              { icon: FiCode, label: 'GitHub Projects', value: '100+ Repositories', color: 'text-gray-300' },
              { icon: FiGlobe, label: 'Countries Reached', value: '45+ Countries', color: 'text-green-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
                <Icon className={`${color} text-xl mb-2`} />
                <p className="text-white font-semibold text-sm">{value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/courses" className="btn-primary px-6 py-3">
              View My Courses <FiArrowRight />
            </Link>
            <Link to="/about" className="btn-secondary px-6 py-3">
              Full Bio
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

// ─── Letter-by-letter looping heading ─────────────────────────────────────────
// "Learn Without" on line 1, "Limits" gradient on line 2
// Each letter slides up + fades in one by one, holds, then slides down to exit, loops

const LINE1 = 'Learn Without'
const LINE2 = 'Limits'
const TOTAL_LETTERS = LINE1.length + LINE2.length   // 19

const AnimatedHeading = () => {
  const [cycle, setCycle] = useState(0)
  const [animating, setAnimating] = useState(true)   // true = in, false = out

  // Timing: each letter 55ms apart
  // in-anim ends at: TOTAL_LETTERS * 0.055 + 0.45 ≈ 1.5s
  // hold for 2s, then exit, then loop
  useEffect(() => {
    const inDuration  = TOTAL_LETTERS * 55 + 500    // ms letters finish appearing
    const holdDuration = 2000
    const outDuration  = TOTAL_LETTERS * 30 + 400

    const holdTimer = setTimeout(() => setAnimating(false), inDuration + holdDuration)
    const loopTimer = setTimeout(() => {
      setAnimating(true)
      setCycle(c => c + 1)
    }, inDuration + holdDuration + outDuration)

    return () => { clearTimeout(holdTimer); clearTimeout(loopTimer) }
  }, [cycle])

  const renderLetters = (text, isGradient) =>
    text.split('').map((char, i) => {
      const globalIdx = isGradient ? LINE1.length + i : i
      const inDelay   = globalIdx * 0.055
      const outDelay  = (TOTAL_LETTERS - 1 - globalIdx) * 0.030

      return (
        <motion.span
          key={`${cycle}-${isGradient ? 'b' : 'a'}-${i}`}
          initial={{ opacity: 0, y: 52, filter: 'blur(8px)' }}
          animate={animating
            ? { opacity: 1, y: 0,  filter: 'blur(0px)' }
            : { opacity: 0, y: -36, filter: 'blur(6px)' }
          }
          transition={{
            delay:    animating ? inDelay : outDelay,
            duration: animating ? 0.45    : 0.32,
            ease:     animating ? [0.22, 1, 0.36, 1] : [0.55, 0, 1, 0.45],
          }}
          className="inline-block"
          style={{
            willChange: 'transform, opacity, filter',
            // Apply gradient per-letter so bg-clip-text works on inline-block children
            ...(isGradient ? {
              background: 'linear-gradient(90deg, #60a5fa, #c084fc, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            } : {}),
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      )
    })

  return (
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] mb-4">
      <span className="block tracking-tight">
        {renderLetters(LINE1, false)}
      </span>
      <span className="block tracking-tight">
        {renderLetters(LINE2, true)}
      </span>
    </h1>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
const Home = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/courses/featured')
      .then(({ data }) => setFeatured(data))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-gray-950 pt-16 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-700/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-900/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 py-8">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-4 lg:gap-6 items-center">

            {/* LEFT: Text content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:pl-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 rounded-full px-4 py-2 text-sm text-blue-300 mb-4"
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                India's #1 Rated Learning Platform · Rated 4.9/5
              </motion.div>

              <AnimatedHeading />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="text-lg md:text-xl text-gray-400 leading-relaxed mb-6 max-w-lg"
              >
                Master in-demand skills with India's best instructors. Join <span className="text-white font-semibold">50,000+ learners</span> who transformed their careers with CodingCollege.
              </motion.p>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="mb-6"
              >
                <SearchBar placeholder="What do you want to learn? e.g. React, Python, DSA..." />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95 }}
                className="flex flex-wrap gap-3 mb-7"
              >
                <Link to="/courses" className="btn-primary text-base px-7 py-3.5 shadow-lg shadow-blue-900/40">
                  Explore Courses <FiArrowRight />
                </Link>
                <button
                  onClick={() => document.getElementById('demo-video').scrollIntoView({ behavior: 'smooth' })}
                  className="btn-secondary text-base px-7 py-3.5"
                >
                  <FiPlay className="text-blue-400" /> Watch Demo
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap gap-5 pt-5 border-t border-gray-800/60"
              >
                {[
                  { value: '50K+', label: 'Active Students' },
                  { value: '200+', label: 'Expert Courses' },
                  { value: '98%', label: 'Job Success Rate' },
                  { value: '4.9★', label: 'Average Rating' },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + i * 0.07 }}
                    className="text-center"
                  >
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT: Visual — no extra offset, fills column */}
            <div className="hidden lg:flex items-center justify-center">
              <HeroVisual />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          <span className="text-xs">Scroll to explore</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-gray-600 to-transparent" />
        </motion.div>
      </section>

      {/* ── TRUSTED BY ───────────────────────────────────────────────────── */}
      <section className="py-10 border-y border-gray-800/50 bg-gray-900/30">
        <div className="page-container">
          <p className="text-center text-gray-600 text-sm uppercase tracking-widest mb-6">Trusted by students from</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Razorpay', 'Swiggy', 'Zomato', 'PhonePe'].map(company => (
              <span key={company} className="text-gray-600 font-bold text-sm md:text-base tracking-wide hover:text-gray-400 transition-colors cursor-default">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Explore Top Categories</h2>
            <p className="text-gray-400 text-lg">Find the perfect course in your area of interest</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map(cat => {
              const Icon = cat.icon
              return (
                <motion.div key={cat.name} variants={fade}>
                  <Link
                    to={`/courses?category=${encodeURIComponent(cat.name)}`}
                    className={`group block bg-gray-900 border rounded-2xl p-5 text-center transition-all hover:-translate-y-1.5 hover:shadow-xl ${cat.bg}`}
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="text-white text-2xl" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors leading-tight mb-1">{cat.name}</h3>
                    <p className="text-xs text-gray-500">{cat.courses} courses</p>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED COURSES ─────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-900/30">
        <div className="page-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Handpicked for you</p>
              <h2 className="text-3xl md:text-4xl font-black text-white">Featured Courses</h2>
            </div>
            <Link to="/courses" className="btn-outline hidden sm:flex">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton aspect-video" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-4 rounded w-3/4" />
                    <div className="skeleton h-3 rounded w-1/2" />
                    <div className="skeleton h-3 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <motion.div
              variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featured.map(course => (
                <motion.div key={course._id} variants={fade}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 card">
              <FiBookOpen className="text-gray-700 text-5xl mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No featured courses yet — check back soon!</p>
              <Link to="/courses" className="btn-primary">Browse All Courses</Link>
            </div>
          )}
          <div className="text-center mt-8 sm:hidden">
            <Link to="/courses" className="btn-outline">View All Courses <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ── VIDEO DEMO ───────────────────────────────────────────────────── */}
      <VideoSection />

      {/* ── CO-FOUNDER / INSTRUCTOR ───────────────────────────────────────── */}
      <CoFounderSection />

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-gray-900/30">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">How It Works</h2>
            <p className="text-gray-400 text-lg">Get started in just 3 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[calc(33%+1rem)] w-[calc(33%-2rem)] h-px bg-gradient-to-r from-blue-600/50 to-purple-600/50" />
            <div className="hidden md:block absolute top-16 left-[calc(66%+1rem)] w-[calc(25%)] h-px bg-gradient-to-r from-purple-600/50 to-pink-600/50" />

            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-gray-700 transition-all group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/30">
                    <Icon className="text-white text-2xl" />
                  </div>
                  <div className="absolute top-4 right-4 text-5xl font-black text-gray-800 select-none">{step.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{step.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-blue-900/20 via-purple-900/15 to-blue-900/20 border-y border-gray-800/50">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: '50,000+', label: 'Active Learners', icon: FiUsers, color: 'text-blue-400' },
              { value: '200+', label: 'Expert Courses', icon: FiBookOpen, color: 'text-purple-400' },
              { value: '98%', label: 'Completion Rate', icon: FiZap, color: 'text-yellow-400' },
              { value: '4.9/5', label: 'Average Rating', icon: FiStar, color: 'text-green-400' },
            ].map(s => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="w-14 h-14 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className={`${s.color} text-2xl`} />
                  </div>
                  <div className="text-4xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-gray-400 text-sm">{s.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">What Our Students Say</h2>
            <p className="text-gray-400 text-lg">Real results from real learners</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <FiMessageCircle className="text-gray-700 text-3xl mb-3" />
                <p className="text-gray-300 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                  <div className={`w-11 h-11 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white text-sm font-black`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-950 to-purple-950" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />

        <div className="page-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 rounded-full px-4 py-2 text-sm text-blue-300 mb-6">
              <FiZap /> Limited Seats Available
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              Ready to Start
              <span className="block gradient-text">Your Journey?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Join 50,000+ students. Get lifetime access to all courses, certificates, and a community that helps you grow.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-9 py-4 shadow-xl shadow-blue-900/40">
                Get Started — It's Free <FiArrowRight />
              </Link>
              <Link to="/courses" className="btn-secondary text-base px-9 py-4">
                Browse Courses
              </Link>
            </div>
            <p className="text-gray-600 text-sm mt-5">No credit card required · Cancel anytime · 30-day money back</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
