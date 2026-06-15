import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { agencyService } from '../services/agency.service'
import { reviewService } from '../services/review.service'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import StarRating from '../components/common/StarRating'
import ReviewCard from '../components/common/ReviewCard'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

export default function AgencyProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [agency, setAgency] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      agencyService.getById(id),
      reviewService.list({ targetType: 'agency', targetId: id, limit: 10 }),
    ])
      .then(([agencyRes, reviewRes]) => {
        setAgency(agencyRes.data.data)
        setReviews(reviewRes.data.data || [])
      })
      .catch((err) => setError(err.response?.data?.message || 'Impossible de charger le profil'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Chargement de l'agence..." />
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />
  if (!agency) return <ErrorMessage message="Agence non trouvée" />

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="relative bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mb-24 relative z-10">
            <img
              src={agency.logo || '/images/default-avatar.png'}
              alt={agency.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-xl object-cover"
            />
            <div className="text-center md:text-left text-white flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">{agency.name}</h1>
              <p className="text-secondary-200 text-lg mt-1">{agency.city || 'Madagascar'}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                <StarRating rating={parseFloat(agency.rating) || 0} size="md" showValue />
                <span className="text-secondary-200">{agency._count?.guides || 0} guides partenaires</span>
                {agency.status === 'verified' && (
                  <span className="bg-primary-500 text-white text-xs px-3 py-1 rounded-full font-medium">Vérifié</span>
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
              <p className="text-gray-600 leading-relaxed">{agency.description || 'Aucune description'}</p>
            </div>

            {agency.guides?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos guides ({agency.guides.length})</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {agency.guides.map((g) => (
                    <Link key={g.id} to={`/guides/${g.id}`} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-secondary-200 hover:shadow-md transition-all group">
                      <img src={g.user?.avatar || '/images/default-avatar.png'} alt={g.user?.name} className="w-14 h-14 rounded-full object-cover" />
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-secondary-600 transition-colors">{g.user?.name}</h3>
                        <p className="text-sm text-gray-500">{g.specialty || 'Guide'}</p>
                        <StarRating rating={parseFloat(g.rating) || 0} size="sm" />
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
                {agency.address && (
                  <div>
                    <p className="text-gray-500">Adresse</p>
                    <p className="text-gray-900 font-medium">{agency.address}</p>
                  </div>
                )}
                {agency.phone && (
                  <div>
                    <p className="text-gray-500">Téléphone</p>
                    <p className="text-gray-900 font-medium">{agency.phone}</p>
                  </div>
                )}
                {agency.email && (
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{agency.email}</p>
                  </div>
                )}
                {agency.website && (
                  <div>
                    <p className="text-gray-500">Site web</p>
                    <a href={agency.website} target="_blank" rel="noreferrer" className="text-primary-600 font-medium hover:underline">{agency.website}</a>
                  </div>
                )}
              </div>

              {user && (
                <div className="mt-6 space-y-3">
                  <Link
                    to={`/book/agency/${agency.id}`}
                    className="block w-full text-center py-3 bg-secondary-500 text-white rounded-xl font-medium hover:bg-secondary-600 transition-colors"
                  >
                    Réserver un service
                  </Link>
                  <Link
                    to={`/messages?userId=${agency.userId}`}
                    className="block w-full text-center py-3 border border-secondary-200 text-secondary-600 rounded-xl font-medium hover:bg-secondary-50 transition-colors"
                  >
                    Contacter l'agence
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
