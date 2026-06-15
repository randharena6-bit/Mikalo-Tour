import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Une erreur est survenue</h1>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'Une erreur inattendue s\'est produite'}
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
