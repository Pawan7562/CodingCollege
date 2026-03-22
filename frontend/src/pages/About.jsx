import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBookOpen, FiUsers, FiAward, FiTarget, FiHeart, FiYoutube, FiGithub, FiLinkedin, FiTwitter, FiMail, FiCode, FiStar, FiGlobe, FiCheck, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

// ─── Letter-by-letter looping heading ─────────────────────────────────────────
const A_LINE1 = 'Empowering Learners'
const A_LINE2 = 'Worldwide'
const A_TOTAL = A_LINE1.length + A_LINE2.length

const AboutHeading = () => {
  const [cycle, setCycle]       = useState(0)
  const [animating, setAnimating] = useState(true)

  useEffect(() => {
    const inDuration   = A_TOTAL * 55 + 500
    const holdDuration = 2000
    const outDuration  = A_TOTAL * 30 + 400
    const t1 = setTimeout(() => setAnimating(false), inDuration + holdDuration)
    const t2 = setTimeout(() => { setAnimating(true); setCycle(c => c + 1) }, inDuration + holdDuration + outDuration)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [cycle])

  const renderLetters = (text, isGradient) =>
    text.split('').map((char, i) => {
      const globalIdx = isGradient ? A_LINE1.length + i : i
      const inDelay   = globalIdx * 0.055
      const outDelay  = (A_TOTAL - 1 - globalIdx) * 0.030
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
            duration: animating ? 0.45 : 0.32,
            ease:     animating ? [0.22, 1, 0.36, 1] : [0.55, 0, 1, 0.45],
          }}
          className="inline-block"
          style={{
            willChange: 'transform, opacity, filter',
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
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] mb-5">
      <span className="block tracking-tight text-white">
        {renderLetters(A_LINE1, false)}
      </span>
      <span className="block tracking-tight">
        {renderLetters(A_LINE2, true)}
      </span>
    </h1>
  )
}

const values = [
  { icon: FiTarget,   title: 'Excellence',    color: 'from-blue-600 to-blue-800',   desc: 'We maintain the highest standards in every course, ensuring quality education that makes a real difference.' },
  { icon: FiHeart,    title: 'Passion',        color: 'from-red-600 to-pink-700',    desc: 'Our instructors are passionate professionals who love sharing their expertise and seeing students grow.' },
  { icon: FiUsers,    title: 'Community',      color: 'from-green-600 to-teal-700',  desc: 'We foster a collaborative learning environment where students support and inspire each other every day.' },
  { icon: FiAward,    title: 'Recognition',    color: 'from-yellow-600 to-orange-600', desc: 'Our certificates are recognised by top tech companies and startups across India and globally.' },
]

const team = [
  { name: 'Priya Singh',  role: 'Data Science Expert',  initials: 'PS', color: 'from-purple-500 to-pink-600',  expertise: 'Machine Learning & AI',  courses: 8  },
  { name: 'Amit Sharma',  role: 'UI/UX Lead',            initials: 'AS', color: 'from-orange-500 to-yellow-500', expertise: 'Product Design',          courses: 6  },
  { name: 'Neha Gupta',   role: 'Backend Engineer',      initials: 'NG', color: 'from-green-500 to-teal-600',  expertise: 'Node.js & Databases',     courses: 9  },
]

const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const About = () => (
  <div className="min-h-screen pt-16">

    {/* ── Hero — split layout with founder image top-right ─────────────── */}
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gray-950 pt-16">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-700/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-700/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/4 pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 py-8">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-center">

          {/* LEFT — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-5"
            >
              <FiBookOpen size={13} /> Our Story
            </motion.div>

            <AboutHeading />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="text-lg md:text-xl text-gray-400 leading-relaxed mb-6 max-w-lg"
            >
              CodingCollege was founded with one mission — make world-class tech education accessible to every student in India and beyond, regardless of background.
            </motion.p>

            {/* Founder tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88 }}
              className="flex items-center gap-4 p-4 bg-gray-900/80 border border-gray-800 rounded-2xl mb-7 w-fit"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                <img src="/Founder.jpeg" alt="Pawan Kumar"
                  className="w-full h-full object-cover object-top"
                  onError={e => { e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg">P</div>' }}
                />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Pawan Kumar</p>
                <p className="text-blue-400 text-xs">Founder & Lead Instructor</p>
              </div>
              <div className="ml-2 flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2.5 py-1">
                <FiStar className="text-yellow-400 fill-yellow-400" size={11} />
                <span className="text-yellow-300 text-xs font-bold">4.9</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/courses" className="btn-primary px-6 py-3">
                Explore Courses <FiArrowRight size={15} />
              </Link>
              <Link to="/contact" className="btn-secondary px-6 py-3">
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT — Founder image, prominent top-right */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-pink-600/10 rounded-3xl blur-2xl" />

              {/* Main image card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/40 border border-gray-700/60"
                style={{ width: 380, height: 480 }}>
                <img
                  src="/Founder.jpeg"
                  alt="Pawan Kumar — Founder & Lead Instructor, CodingCollege"
                  className="w-full h-full object-cover object-top"
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.parentElement.style.background = 'linear-gradient(135deg, #1e3a5f, #3b1d6b)'
                    e.target.parentElement.innerHTML += '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:120px;font-weight:900;color:rgba(255,255,255,0.15)">PK</div>'
                  }}
                />
                {/* Gradient overlay bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />

                {/* Name card bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/60 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-black text-lg leading-tight">Pawan Kumar</p>
                        <p className="text-blue-400 text-sm font-medium">Founder & Lead Instructor</p>
                      </div>
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                        <FiCheck className="text-white" size={16} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-700/60">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => <FiStar key={i} size={11} className="text-yellow-400 fill-yellow-400" />)}
                      </div>
                      <span className="text-gray-400 text-xs">50K+ Students · 8+ Years Exp</span>
                    </div>
                  </div>
                </div>

                {/* Top-right: experience badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0, type: 'spring', stiffness: 200 }}
                  className="absolute top-4 right-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-black rounded-2xl px-3 py-2 shadow-xl text-xs font-black"
                >
                  <p className="text-lg font-black leading-none">8+</p>
                  <p className="text-[10px] font-bold">Yrs Exp</p>
                </motion.div>

                {/* Top-left: courses badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.15, type: 'spring', stiffness: 200 }}
                  className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-2xl px-3 py-2 shadow-xl"
                >
                  <p className="text-white text-lg font-black leading-none">12+</p>
                  <p className="text-gray-400 text-[10px] font-medium">Courses</p>
                </motion.div>
              </div>

              {/* Social links — below image, floating */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-2 bg-gray-900/90 backdrop-blur border border-gray-700/60 rounded-2xl px-4 py-2.5 shadow-xl"
              >
                {[
                  { icon: FiYoutube,  c: 'hover:text-red-400',  href: '#' },
                  { icon: FiLinkedin, c: 'hover:text-blue-400', href: '#' },
                  { icon: FiGithub,   c: 'hover:text-gray-300', href: '#' },
                  { icon: FiTwitter,  c: 'hover:text-sky-400',  href: '#' },
                  { icon: FiMail,     c: 'hover:text-green-400',href: '#' },
                ].map(({ icon: Icon, c, href }, i) => (
                  <a key={i} href={href}
                    className={`w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 transition-all hover:-translate-y-0.5 ${c}`}>
                    <Icon size={14} />
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>

    {/* ── Stats ────────────────────────────────────────────────────────── */}
    <section className="py-12 border-y border-gray-800/60 bg-gray-900/30">
      <div className="page-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: '50,000+', label: 'Happy Students',  icon: FiUsers   },
            { value: '200+',    label: 'Expert Courses',  icon: FiBookOpen },
            { value: '50+',     label: 'Instructors',     icon: FiAward   },
            { value: '4.9/5',   label: 'Average Rating',  icon: FiStar    },
          ].map(s => {
            const Icon = s.icon
            return (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <Icon className="text-blue-400 text-2xl mx-auto mb-2" />
                <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>

    {/* ── Founder detail row ───────────────────────────────────────────── */}
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-gray-950 to-purple-950/30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />
      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8 md:p-10"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-2">Founder's Vision</p>
              <h3 className="text-3xl font-black text-white mb-4">The Mind Behind CodingCollege</h3>
              <blockquote className="bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl px-5 py-3 mb-5">
                <p className="text-gray-200 italic leading-relaxed">
                  "My mission is to make world-class tech education accessible to every student in India and beyond. Code is the superpower of the 21st century — and I want to give it to you."
                </p>
              </blockquote>
              <p className="text-gray-400 leading-relaxed mb-5">
                With over <span className="text-white font-semibold">8+ years of industry experience</span>, Pawan has built production systems used by millions. He founded{' '}
                <span className="text-blue-400 font-semibold">CodingCollege</span> to bridge the gap between academic learning and real-world development.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['React.js', 'Node.js', 'MongoDB', 'TypeScript', 'System Design', 'DSA', 'DevOps', 'AWS'].map(tag => (
                  <span key={tag} className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-full hover:border-blue-600 hover:text-blue-300 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: FiYoutube, label: 'YouTube',   value: '500K+ Subs',  color: 'text-red-400'   },
                  { icon: FiCode,    label: 'GitHub',     value: '100+ Repos',  color: 'text-gray-300'  },
                  { icon: FiGlobe,   label: 'Countries',  value: '45+ Reached', color: 'text-green-400' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-3 hover:border-gray-600 transition-colors">
                    <Icon className={`${color} text-lg mb-1.5`} />
                    <p className="text-white font-bold text-sm">{value}</p>
                    <p className="text-gray-500 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right mini-image */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4 md:w-52">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
                <img src="/Founder.jpeg" alt="Pawan Kumar" className="w-full h-full object-cover object-top"
                  onError={e => { e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-700 to-purple-800 flex items-center justify-center text-white text-5xl font-black">PK</div>' }}
                />
              </div>
              <div className="flex gap-2">
                {[
                  { icon: FiYoutube,  c: 'hover:text-red-400',  href: '#' },
                  { icon: FiLinkedin, c: 'hover:text-blue-400', href: '#' },
                  { icon: FiGithub,   c: 'hover:text-gray-300', href: '#' },
                  { icon: FiMail,     c: 'hover:text-green-400',href: '#' },
                ].map(({ icon: Icon, c, href }, i) => (
                  <a key={i} href={href}
                    className={`w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 transition-all hover:-translate-y-0.5 ${c}`}>
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Mission & Vision ─────────────────────────────────────────────── */}
    <section className="py-20 bg-gray-900/30">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { icon: FiTarget,   color: 'from-blue-600 to-blue-800',   title: 'Our Mission',
              desc: 'To democratise education by providing high-quality, affordable online courses that empower individuals to achieve their career goals. We believe every person deserves world-class instruction.' },
            { icon: FiBookOpen, color: 'from-purple-600 to-purple-800', title: 'Our Vision',
              desc: 'To become the leading online education platform in South Asia — creating a world where knowledge has no borders and every learner can access premium education regardless of background or location.' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
              <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-5 shadow-lg`}>
                <Icon className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
              <p className="text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Our Core Values</h2>
          <p className="text-gray-400">The principles that guide everything we do</p>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map(v => {
            const Icon = v.icon
            return (
              <motion.div key={v.title} variants={fade}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 bg-gradient-to-br ${v.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="font-bold text-white mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Team */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Meet Our Instructors</h2>
          <p className="text-gray-400">Learn from industry professionals with real-world experience</p>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map(m => (
            <motion.div key={m.name} variants={fade}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-7 text-center hover:border-gray-700 hover:-translate-y-1 transition-all group">
              <div className={`w-20 h-20 bg-gradient-to-br ${m.color} rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                {m.initials}
              </div>
              <h3 className="font-bold text-white mb-1">{m.name}</h3>
              <p className="text-blue-400 text-sm mb-1">{m.role}</p>
              <p className="text-gray-500 text-xs mb-3">{m.expertise}</p>
              <span className="inline-flex items-center px-3 py-1 bg-blue-900/30 border border-blue-800/50 rounded-full text-xs text-blue-300">
                {m.courses} courses
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── CTA ──────────────────────────────────────────────────────────── */}
    <section className="py-20 bg-gradient-to-br from-blue-950/40 to-purple-950/40 border-t border-gray-800/60">
      <div className="page-container text-center">
        <Logo size="lg" className="justify-center mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Join Our Community?</h2>
        <p className="text-gray-400 mb-8 text-lg">Start your learning journey with 50,000+ students</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="btn-primary px-8 py-3">Get Started Free</Link>
          <Link to="/courses" className="btn-secondary px-8 py-3">Browse Courses</Link>
        </div>
      </div>
    </section>
  </div>
)

export default About
