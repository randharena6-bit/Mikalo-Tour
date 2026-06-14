import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Comment ça marche', href: '#how-it-works' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Témoignages', href: '#testimonials' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className={`font-bold text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Mikalo <span className="text-primary-500">Tour</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary-500 ${
                  scrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button className="text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors px-4 py-2">
              Connexion
            </button>
            <button className="text-sm font-semibold bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300">
              S&apos;inscrire
            </button>
          </div>

          <button
            className={`lg:hidden p-2 ${scrolled ? 'text-gray-900' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-gray-700 font-medium py-2 hover:text-primary-500 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <hr className="border-gray-100 my-3" />
            <button className="w-full text-center text-gray-700 font-medium py-2 hover:text-primary-500">
              Connexion
            </button>
            <button className="w-full text-center bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold py-3 rounded-full">
              S&apos;inscrire
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
