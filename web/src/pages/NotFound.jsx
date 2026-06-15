import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 flex items-center justify-center px-4">
      <div className="text-center text-white">
        <h1 className="text-8xl font-bold text-primary-400 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="px-8 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/marketplace"
            className="px-8 py-3 border border-gray-600 text-gray-300 rounded-xl font-medium hover:border-gray-500 hover:text-white transition-colors"
          >
            Explorer
          </Link>
        </div>
      </div>
    </div>
  )
}
