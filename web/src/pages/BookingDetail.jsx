import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { bookingService } from '../services/booking.service'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import Footer from '../components/common/Footer'

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  confirmed: { label: 'Confirmé', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
  in_progress: { label: 'En cours', color: 'bg-green-100 text-green-700', dot: 'bg-green-400' },
  completed: { label: 'Terminé', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
  refunded: { label: 'Remboursé', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
}

const STATUS_ORDER = ['pending', 'confirmed', 'in_progress', 'completed']

export default function BookingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    bookingService.getById(id)
      .then((res) => setBooking(res.data.data.booking))
      .catch((err) => setError(err.response?.data?.message || 'Impossible de charger la réservation'))
      .finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return
    setCancelling(true)
    try {
      await bookingService.cancel(id)
      const res = await bookingService.getById(id)
      setBooking(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'annulation')
    } finally {
      setCancelling(false)
    }
  }

  const handleStatusChange = async (status) => {
    try {
      await bookingService.updateStatus(id, { status })
      const res = await bookingService.getById(id)
      setBooking(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour')
    }
  }

  if (loading) return <LoadingSpinner text="Chargement de la réservation..." />
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />
  if (!booking) return <ErrorMessage message="Réservation non trouvée" />

  const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
  const currentStep = STATUS_ORDER.indexOf(booking.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <span className="text-primary-200 text-sm">Réservation #{booking.id}</span>
          </div>
          <h1 className="text-3xl font-bold capitalize">{booking.type?.replace('_', ' ')}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            {STATUS_ORDER.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i <= currentStep ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-primary-600' : 'text-gray-400'}`}>
                    {STATUS_CONFIG[s].label}
                  </span>
                </div>
                {i < STATUS_ORDER.length - 1 && (
                  <div className={`w-12 md:w-20 h-0.5 mx-2 ${i < currentStep ? 'bg-primary-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Détails</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date de début</span>
                  <span className="font-medium">{new Date(booking.startDate).toLocaleDateString('fr-FR')}</span>
                </div>
                {booking.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date de fin</span>
                    <span className="font-medium">{new Date(booking.endDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Durée</span>
                  <span className="font-medium">{booking.duration} {booking.durationUnit}(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Montant total</span>
                  <span className="font-bold text-primary-600 text-lg">{booking.totalAmount?.toLocaleString()} Ar</span>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{booking.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {booking.guide && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Guide</h3>
                <div className="flex items-center gap-3">
                  <img src={booking.guide.user?.avatar || '/images/default-avatar.png'} alt={booking.guide.user?.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.guide.user?.name}</p>
                    <p className="text-sm text-gray-500">{booking.guide.specialty}</p>
                  </div>
                </div>
              </div>
            )}

            {booking.agency && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Agence</h3>
                <div className="flex items-center gap-3">
                  <img src={booking.agency.logo || '/images/default-avatar.png'} alt={booking.agency.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.agency.name}</p>
                    <p className="text-sm text-gray-500">{booking.agency.city}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Paiements</h3>
              {booking.payments?.length > 0 ? (
                <div className="space-y-2">
                  {booking.payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 capitalize">{payment.method?.replace('_', ' ')}</span>
                      <span className={`font-medium ${payment.status === 'success' ? 'text-green-600' : payment.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {payment.amount?.toLocaleString()} Ar - {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun paiement enregistré</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          {booking.status === 'pending' && user?.role === 'tourist' && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-6 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Annulation...' : 'Annuler la réservation'}
            </button>
          )}
          {(user?.role === 'guide' || user?.role === 'agency') && booking.status === 'pending' && (
            <button
              onClick={() => handleStatusChange('confirmed')}
              className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              Confirmer la réservation
            </button>
          )}
          {(user?.role === 'guide' || user?.role === 'agency') && booking.status === 'confirmed' && (
            <button
              onClick={() => handleStatusChange('in_progress')}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              Démarrer le service
            </button>
          )}
          {(user?.role === 'guide' || user?.role === 'agency') && booking.status === 'in_progress' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="px-6 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Marquer comme terminé
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
