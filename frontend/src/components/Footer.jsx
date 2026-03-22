import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FiMail, FiGithub, FiTwitter, FiLinkedin, FiYoutube, FiArrowRight, FiCode } from 'react-icons/fi'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Logo from './Logo'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Subscribed! You\'ll get course updates & tips.')
    setEmail('')
  }

  const links = {
    Learn: [
      { to: '/courses', label: 'All Courses' },
      { to: '/courses?category=Web Development', label: 'Web Development' },
      { to: '/courses?category=Data Science', label: 'Data Science' },
      { to: '/courses?category=UI/UX Design', label: 'UI/UX Design' },
    ],
    Company: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact' },
      { to: '/about', label: 'Careers' },
      { to: '/about', label: 'Blog' },
    ],
    Support: [
      { to: '/contact', label: 'Help Center' },
      { to: '/contact', label: 'Community' },
      { to: '#', label: 'Privacy Policy' },
      { to: '#', label: 'Terms of Service' },
    ],
  }

  const socials = [
    { icon: FiYoutube, href: '#', label: 'YouTube', color: 'hover:text-red-400 hover:border-red-800/60' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-400 hover:border-blue-800/60' },
    { icon: FiTwitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400 hover:border-sky-800/60' },
    { icon: FiGithub, href: '#', label: 'GitHub', color: 'hover:text-gray-200 hover:border-gray-600' },
    { icon: FiMail, href: '#', label: 'Email', color: 'hover:text-green-400 hover:border-green-800/60' },
  ]

  return (
    <footer className="bg-gray-950 border-t border-gray-800/60">

      {/* Top strip */}
      <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/10 to-blue-900/20 border-b border-gray-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FiCode className="text-white text-base" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Ready to start coding?</p>
                <p className="text-gray-400 text-xs">Join 50,000+ learners building real-world skills</p>
              </div>
            </div>
            <Link to="/register" className="btn-primary text-sm px-5 py-2 flex-shrink-0">
              Get Started Free <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-5 hover:opacity-90 transition-opacity">
              <Logo size="md" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              India's leading platform for tech education. Learn Web Dev, Data Science, DSA, and more from industry experts. Build real projects. Get hired.
            </p>

            {/* Newsletter */}
            <p className="text-white text-sm font-semibold mb-3">Get weekly coding tips</p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-gray-900 border border-gray-700 text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600 transition-colors"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors flex-shrink-0"
                title="Subscribe"
              >
                <FiArrowRight />
              </button>
            </form>
            <p className="text-xs text-gray-600 mt-2">No spam. Unsubscribe anytime.</p>
          </div>

          {/* Links columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">{category}</h3>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:translate-x-0.5 inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} <span className="text-gray-400 font-medium">CodingCollege</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-gray-700 text-xs">
              <span>Made with</span>
              <span className="text-red-500">♥</span>
              <span>in India</span>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label, color }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ y: -2 }}
                className={`w-9 h-9 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-gray-500 transition-all duration-200 ${color}`}
              >
                <Icon size={15} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
