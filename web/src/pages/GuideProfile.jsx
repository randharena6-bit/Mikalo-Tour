import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { guideService } from '../services/guide.service'
import { reviewService } from '../services/review.service'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import StarRating from '../components/common/StarRating'
import ReviewCard from '../components/common/ReviewCard'
import Footer from '../components/common/Footer'

export default function GuideProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [guide, setGuide] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      guideService.getById(id),
      reviewService.list({ targetType: 'guide', targetId: id, limit: 10 }),
    ])
      .then(([guideRes, reviewRes]) => {
        setGuide(guideRes.data.data.guide)
        setReviews(reviewRes.data.data?.reviews || [])
      })
      .catch((err) => setError(err.response?.data?.message || 'Impossible de charger le profil'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Chargement du profil guide..." />
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />
  if (!guide) return <ErrorMessage message="Guide non trouvé" />

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mb-24 relative z-10">
            <img
              src={guide.user?.avatar || '/images/default-avatar.png'}
              alt={guide.user?.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-xl object-cover"
            />
            <div className="text-center md:text-left text-white flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">{guide.user?.name}</h1>
              <p className="text-primary-200 text-lg mt-1">{guide.specialty || 'Guide touristique'}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                <StarRating rating={parseFloat(guide.rating) || 0} size="md" showValue />
                <span className="text-primary-200">
                  {guide.experienceYears || 0} ans d'expérience
                </span>
                {guide.certified && (
                  <span className="bg-secondary-500 text-white text-xs px-3 py-1 rounded-full font-medium">Certifié</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos</h2>
              <p className="text-gray-600 leading-relaxed">{guide.bio || 'Aucune description'}</p>
            </div>

            {guide.circuits?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Circuits proposés</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {guide.circuits.map((circuit) => (
                    <Link key={circuit.id} to={`/circuits/${circuit.id}`} className="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all group">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{circuit.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{circuit.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span>{circuit.duration} {circuit.durationUnit}</span>
                        <span>{circuit.difficulty}</span>
                        <span className="font-semibold text-primary-600">{circuit.price?.toLocaleString()} Ar</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {guide.activities?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Activités</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {guide.activities.map((activity) => (
                    <Link key={activity.id} to={`/activities/${activity.id}`} className="p-4 border border-gray-100 rounded-xl hover:border-secondary-200 hover:shadow-md transition-all group">
                      <h3 className="font-semibold text-gray-900 group-hover:text-secondary-600 transition-colors">{activity.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{activity.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span>🏷 {activity.category}</span>
                        <span>{activity.duration} {activity.durationUnit}</span>
                        <span className="font-semibold text-secondary-600">{activity.price?.toLocaleString()} Ar</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Avis ({reviews.length})</h2>
              </div>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun avis pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                {guide.languages?.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-1">Langues parlées</p>
                    <div className="flex flex-wrap gap-1">
                      {guide.languages.map((lang) => (
                        <span key={lang} className="bg-primary-50 text-primary-700 px-2 py-1 rounded-md text-xs">{lang}</span>
                      ))}
                    </div>
                  </div>
                )}
                {guide.location && (
                  <div>
                    <p className="text-gray-500">Localisation</p>
                    <p className="text-gray-900 font-medium">{guide.location}</p>
                  </div>
                )}
                {guide.hourlyRate && (
                  <div>
                    <p className="text-gray-500">Tarif horaire</p>
                    <p className="text-gray-900 font-medium">{guide.hourlyRate.toLocaleString()} Ar/h</p>
                  </div>
                )}
                {guide.dailyRate && (
                  <div>
                    <p className="text-gray-500">Tarif journalier</p>
                    <p className="text-gray-900 font-medium">{guide.dailyRate.toLocaleString()} Ar/jour</p>
                  </div>
                )}
              </div>

              {user && (
                <div className="mt-6 space-y-3">
                  <Link
                    to={`/book/guide/${guide.id}`}
                    className="block w-full text-center py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                  >
                    Réserver ce guide
                  </Link>
                  <Link
                    to={`/messages?userId=${guide.userId}`}
                    className="block w-full text-center py-3 border border-primary-200 text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-colors"
                  >
                    Envoyer un message
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
