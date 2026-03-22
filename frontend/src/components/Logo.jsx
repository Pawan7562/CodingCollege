/**
 * CodingCollege — Professional Logo Component
 * Usage: <Logo /> | <Logo size="lg" /> | <Logo iconOnly /> | <Logo textOnly />
 */

const sizes = {
  xs:  { icon: 24, text: 'text-base',  gap: 'gap-1.5' },
  sm:  { icon: 30, text: 'text-lg',    gap: 'gap-2'   },
  md:  { icon: 36, text: 'text-xl',    gap: 'gap-2.5' },
  lg:  { icon: 44, text: 'text-2xl',   gap: 'gap-3'   },
  xl:  { icon: 56, text: 'text-3xl',   gap: 'gap-3.5' },
  '2xl':{ icon: 72, text: 'text-4xl',  gap: 'gap-4'   },
}

const LogoIcon = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cc-grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#2563eb" />
        <stop offset="50%"  stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
      <linearGradient id="cc-grad-code" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#e9d5ff" />
      </linearGradient>
      <filter id="cc-glow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Background shape — rounded square */}
    <rect x="1" y="1" width="46" height="46" rx="12" fill="url(#cc-grad-bg)" />

    {/* Subtle inner shine */}
    <rect x="1" y="1" width="46" height="23" rx="12" fill="white" fillOpacity="0.06" />

    {/* Code brackets < > */}
    <path
      d="M14 24L9 19.5L14 15"
      stroke="url(#cc-grad-code)"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#cc-glow)"
    />
    <path
      d="M34 24L39 19.5L34 15"
      stroke="url(#cc-grad-code)"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#cc-glow)"
    />

    {/* Forward slash / */}
    <line
      x1="28" y1="13"
      x2="20" y2="26"
      stroke="white"
      strokeWidth="2.6"
      strokeLinecap="round"
      opacity="0.9"
    />

    {/* Bottom dot accent */}
    <circle cx="24" cy="33" r="2.2" fill="white" fillOpacity="0.7" />
    <circle cx="18" cy="33" r="1.4" fill="white" fillOpacity="0.35" />
    <circle cx="30" cy="33" r="1.4" fill="white" fillOpacity="0.35" />
  </svg>
)

const Logo = ({
  size = 'md',
  iconOnly = false,
  textOnly = false,
  className = '',
  light = false,
}) => {
  const s = sizes[size] || sizes.md

  if (iconOnly) return <LogoIcon size={s.icon} />

  if (textOnly) {
    return (
      <span className={`font-black tracking-tight ${s.text} ${className}`}>
        <span className={light ? 'text-white' : 'text-white'}>Coding</span>
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          College
        </span>
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <LogoIcon size={s.icon} />
      <span className={`font-black tracking-tight leading-none ${s.text}`}>
        <span className="text-white">Coding</span>
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          College
        </span>
      </span>
    </span>
  )
}

export { LogoIcon }
export default Logo
