import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const roleDashboards = {
  tourist: '/dashboard',
  guide: '/dashboard/guide',
  agency: '/dashboard/agency',
  admin: '/dashboard/admin',
}

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    Promise.resolve().then(() => setMenuOpen(false))
  }, [location.pathname])

  const isHome = location.pathname === '/'

  const navLinks = user
    ? [
        { label: 'Accueil', href: '/' },
        { label: 'Marketplace', href: '/marketplace' },
        { label: 'Tableau de bord', href: roleDashboards[user.role] || '/dashboard' },
        { label: 'Réservations', href: '/bookings' },
      ]
    : [
        { label: 'Accueil', href: '/' },
        { label: 'Marketplace', href: '/marketplace' },
        { label: 'Fonctionnalités', href: '/#features' },
        { label: 'Destinations', href: '/#destinations' },
      ]
  const isActive = (href) => {
    if (href.startsWith('/#')) return false
    return location.pathname === href
  }

  const isDarkBg = !scrolled && isHome
  const linkClass = (href) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(href)
        ? 'bg-primary-50 text-primary-600'
        : isDarkBg
          ? 'text-white/80 hover:text-white hover:bg-white/10'
          : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'
    }`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className={`font-bold text-xl transition-colors ${isDarkBg ? 'text-white' : 'text-gray-900'}`}>
              Mikalo <span className="text-primary-500">Tour</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to="/search"
              className={`p-2.5 rounded-lg transition-colors ${
                isDarkBg
                  ? 'text-white/60 hover:text-white hover:bg-white/10'
                  : 'text-gray-400 hover:text-primary-500 hover:bg-gray-100'
              }`}
              title="Rechercher"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {user ? (
              <div className="flex items-center gap-1">
                <Link to="/messages" className={linkClass('/messages')}>
                  Messages
                </Link>
                <div className="ml-1 pl-2 border-l border-gray-200 flex items-center gap-1">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 py-1.5 pl-2 pr-3 rounded-lg transition-colors ${
                      isDarkBg ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src={user.avatar || '/images/default-avatar.png'}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <span className={`text-sm font-medium ${isDarkBg ? 'text-white/90' : 'text-gray-700'}`}>
                      {user.name}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`p-2.5 rounded-lg transition-colors ${
                      isDarkBg
                        ? 'text-white/60 hover:text-red-300 hover:bg-white/10'
                        : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                    }`}
                    title="Déconnexion"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDarkBg
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-gradient-to-r from-primary-500 to-primary-700 text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2.5 rounded-lg transition-colors ${
              isDarkBg ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/search"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Recherche
            </Link>
            <hr className="border-gray-100 my-3" />
            {user ? (
              <>
                <Link to="/messages" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Messages
                </Link>
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors">
                  <img
                    src={user.avatar || '/images/default-avatar.png'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  {user.name}
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500 transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="block text-center bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold py-3 rounded-xl hover:shadow-md transition-shadow">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
