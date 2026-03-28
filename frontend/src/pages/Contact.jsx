import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend, FiGithub, FiTwitter, FiLinkedin, FiYoutube } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'

const contactInfo = [
  { icon: FiMail, title: 'Email Us', value: 'support@college.edu', sub: 'We reply within 24 hours' },
  { icon: FiPhone, title: 'Call Us', value: '+91 98765 43210', sub: 'Mon-Fri, 9am-6pm IST' },
  { icon: FiMapPin, title: 'Visit Us', value: 'Bangalore, Karnataka', sub: 'India 560001' },
]

const socials = [
  { icon: FiTwitter, href: '#', name: 'Twitter' },
  { icon: FiLinkedin, href: '#', name: 'LinkedIn' },
  { icon: FiYoutube, href: '#', name: 'YouTube' },
  { icon: FiGithub, href: '#', name: 'GitHub' },
]

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all required fields')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success("Message sent! We'll get back to you soon.")
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-950 text-center border-b border-gray-800">
        <div className="page-container max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Get In Touch</h1>
          <p className="text-gray-400 text-lg">Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-5">
              {contactInfo.map(info => {
                const Icon = info.icon
                return (
                  <div key={info.title} className="card p-5 flex items-start gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-0.5">{info.title}</h3>
                      <p className="text-blue-400 text-sm font-medium">{info.value}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{info.sub}</p>
                    </div>
                  </div>
                )
              })}

              {/* Social Links */}
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socials.map(s => {
                    const Icon = s.icon
                    return (
                      <a
                        key={s.name}
                        href={s.href}
                        aria-label={s.name}
                        className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-700 transition-all hover:-translate-y-0.5"
                      >
                        <Icon size={17} />
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="card p-5 h-48 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <FiMapPin className="text-blue-400 text-3xl mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Bangalore, India</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 text-xs hover:underline mt-1 block"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card p-7">
                <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us how we can help..."
                      className="input-field resize-none"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary text-base px-8 py-3">
                    {loading ? <Loader size="sm" /> : <><FiSend /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-900/50 border-t border-gray-800">
        <div className="page-container max-w-3xl">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How do I enroll in a course?', a: 'Simply browse our courses, click on one you like, and click the Enroll button. For free courses, enrollment is instant. For paid courses, you can pay via Stripe or Razorpay.' },
              { q: 'Can I get a refund?', a: 'Yes, we offer a 30-day money-back guarantee. If you are not satisfied with a course, contact us within 30 days of purchase.' },
              { q: 'Do I get a certificate after completion?', a: 'Yes! Upon completing a course (100% progress), you receive a Certificate of Completion that you can share on LinkedIn and other platforms.' },
              { q: 'How long do I have access to a course?', a: 'Once enrolled, you have lifetime access to the course materials. You can revisit content anytime.' },
            ].map((faq, i) => (
              <details key={i} className="card group">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <h3 className="font-semibold text-white pr-4">{faq.q}</h3>
                  <div className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0">▼</div>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
