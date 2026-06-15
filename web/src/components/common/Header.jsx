import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Fonctionnalités', href: '/#features' },
  { label: 'Destinations', href: '/#destinations' },
]

const roleDashboards = {
  tourist: '/dashboard',
  guide: '/dashboard/guide',
  agency: '/dashboard/agency',
  admin: '/dashboard/admin',
}

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = window.location.pathname === '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className={`font-bold text-xl ${scrolled || !isHome ? 'text-gray-900' : 'text-white'}`}>
              Mikalo <span className="text-primary-500">Tour</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary-500 ${
                  scrolled || !isHome ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link to="/search" className={`p-2 ${scrolled || !isHome ? 'text-gray-500 hover:text-primary-500' : 'text-white/70 hover:text-white'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            {user ? (
              <>
                <Link to={roleDashboards[user.role] || '/dashboard'} className={`text-sm font-medium ${scrolled || !isHome ? 'text-gray-700' : 'text-white/90'} hover:text-primary-500 transition-colors`}>
                  Tableau de bord
                </Link>
                <Link to="/messages" className={`text-sm font-medium ${scrolled || !isHome ? 'text-gray-700' : 'text-white/90'} hover:text-primary-500 transition-colors`}>
                  Messages
                </Link>
                <Link to="/bookings" className={`text-sm font-medium ${scrolled || !isHome ? 'text-gray-700' : 'text-white/90'} hover:text-primary-500 transition-colors`}>
                  Réservations
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <Link to="/profile" className="flex items-center gap-2 group">
                    <img
                      src={user.avatar || '/images/default-avatar.png'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className={`text-sm font-medium ${scrolled || !isHome ? 'text-gray-700' : 'text-white/90'} group-hover:text-primary-500 transition-colors`}>
                      {user.name}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`text-sm font-medium ${scrolled || !isHome ? 'text-gray-500 hover:text-red-500' : 'text-white/70 hover:text-red-400'} transition-colors`}
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-medium ${scrolled || !isHome ? 'text-gray-700' : 'text-white/90'} hover:text-primary-500 transition-colors px-4 py-2`}>
                  Connexion
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          <button
            className={`lg:hidden p-2 ${scrolled || !isHome ? 'text-gray-900' : 'text-white'}`}
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
              <Link
                key={link.href}
                to={link.href}
                className="block text-gray-700 font-medium py-2 hover:text-primary-500 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/search" className="block text-gray-700 font-medium py-2 hover:text-primary-500 transition-colors" onClick={() => setMenuOpen(false)}>
              Recherche
            </Link>
            <hr className="border-gray-100 my-3" />
            {user ? (
              <>
                <Link to={roleDashboards[user.role] || '/dashboard'} className="block text-gray-700 font-medium py-2 hover:text-primary-500" onClick={() => setMenuOpen(false)}>
                  Tableau de bord
                </Link>
                <Link to="/messages" className="block text-gray-700 font-medium py-2 hover:text-primary-500" onClick={() => setMenuOpen(false)}>
                  Messages
                </Link>
                <Link to="/bookings" className="block text-gray-700 font-medium py-2 hover:text-primary-500" onClick={() => setMenuOpen(false)}>
                  Réservations
                </Link>
                <Link to="/profile" className="block font-medium py-2 text-primary-500" onClick={() => setMenuOpen(false)}>
                  {user.name}
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className="w-full text-center text-red-500 font-medium py-2 hover:text-red-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block w-full text-center text-gray-700 font-medium py-2 hover:text-primary-500" onClick={() => setMenuOpen(false)}>
                  Connexion
                </Link>
                <Link to="/register" className="block w-full text-center bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold py-3 rounded-full" onClick={() => setMenuOpen(false)}>
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
