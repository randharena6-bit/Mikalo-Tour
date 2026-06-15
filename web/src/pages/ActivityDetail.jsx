import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { marketplaceService } from '../services/marketplace.service'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import Footer from '../components/common/Footer'

export default function ActivityDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    marketplaceService.getActivity(id)
      .then((res) => setActivity(res.data.data.activity))
      .catch((err) => setError(err.response?.data?.message || 'Impossible de charger l\'activité'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Chargement de l'activité..." />
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />
  if (!activity) return <ErrorMessage message="Activité non trouvée" />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-secondary-600 to-secondary-900">
        {activity.images?.[0] && (
          <img src={activity.images[0]} alt={activity.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-secondary-500 text-white text-xs px-3 py-1 rounded-full font-medium uppercase">{activity.category}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{activity.title}</h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              {activity.location && <span>📍 {activity.location}</span>}
              <span>⏱ {activity.duration} {activity.durationUnit}</span>
              {activity.author && <span>Par {activity.author.name}</span>}
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{activity.description}</p>
            </div>

            {activity.includes?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce qui est inclus</h2>
                <ul className="space-y-2">
                  {activity.includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-secondary-600">{activity.price?.toLocaleString()} Ar</p>
                <p className="text-sm text-gray-500">par personne</p>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Durée</span>
                  <span className="font-medium">{activity.duration} {activity.durationUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Catégorie</span>
                  <span className="font-medium capitalize">{activity.category}</span>
                </div>
                {activity.maxParticipants && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Participants max</span>
                    <span className="font-medium">{activity.maxParticipants}</span>
                  </div>
                )}
              </div>

              {activity.author && (
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <p className="text-xs text-gray-500 mb-2">Proposé par</p>
                  <Link to={`/guides/${activity.authorId}`} className="flex items-center gap-3 group">
                    <img src={activity.author.avatar || '/images/default-avatar.png'} alt={activity.author.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-sm font-medium text-gray-900 group-hover:text-secondary-600 transition-colors">{activity.author.name}</span>
                  </Link>
                </div>
              )}

              {user ? (
                <Link
                  to={`/book/activity/${activity.id}`}
                  className="block w-full text-center py-3 bg-secondary-500 text-white rounded-xl font-medium hover:bg-secondary-600 transition-colors"
                >
                  Réserver maintenant
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center py-3 bg-secondary-500 text-white rounded-xl font-medium hover:bg-secondary-600 transition-colors"
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
