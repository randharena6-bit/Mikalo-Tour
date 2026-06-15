import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { marketplaceService } from '../services/marketplace.service'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import StarRating from '../components/common/StarRating'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

export default function CircuitDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [circuit, setCircuit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    marketplaceService.getCircuit(id)
      .then((res) => setCircuit(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Impossible de charger le circuit'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Chargement du circuit..." />
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />
  if (!circuit) return <ErrorMessage message="Circuit non trouvé" />

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="relative h-64 md:h-96 bg-gradient-to-br from-primary-600 to-primary-900">
        {circuit.images?.[0] && (
          <img src={circuit.images[0]} alt={circuit.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{circuit.title}</h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span>📍 {circuit.location || 'Madagascar'}</span>
              <span>⏱ {circuit.duration} {circuit.durationUnit}</span>
              <span>📊 {circuit.difficulty}</span>
              {circuit.author && <span>Par {circuit.author.name}</span>}
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{circuit.description}</p>
            </div>

            {circuit.highlights?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Points forts</h2>
                <ul className="space-y-3">
                  {circuit.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-secondary-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {circuit.itinerary?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinéraire</h2>
                <div className="space-y-6">
                  {circuit.itinerary.map((day, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {i + 1}
                        </div>
                        {i < circuit.itinerary.length - 1 && <div className="w-0.5 h-full bg-primary-200 mt-2" />}
                      </div>
                      <div className="pb-6">
                        <h3 className="font-semibold text-gray-900">{day.title || `Jour ${i + 1}`}</h3>
                        <p className="text-gray-600 text-sm mt-1">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary-600">{circuit.price?.toLocaleString()} Ar</p>
                <p className="text-sm text-gray-500">par personne</p>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Durée</span>
                  <span className="font-medium">{circuit.duration} {circuit.durationUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Difficulté</span>
                  <span className="font-medium capitalize">{circuit.difficulty}</span>
                </div>
                {circuit.maxParticipants && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Participants max</span>
                    <span className="font-medium">{circuit.maxParticipants}</span>
                  </div>
                )}
              </div>

              {circuit.author && (
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <p className="text-xs text-gray-500 mb-2">Proposé par</p>
                  <Link to={`/guides/${circuit.authorId}`} className="flex items-center gap-3 group">
                    <img src={circuit.author.avatar || '/images/default-avatar.png'} alt={circuit.author.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{circuit.author.name}</span>
                  </Link>
                </div>
              )}

              {user ? (
                <Link
                  to={`/book/circuit/${circuit.id}`}
                  className="block w-full text-center py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                >
                  Réserver maintenant
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                >
                  Connectez-vous pour réserver
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
