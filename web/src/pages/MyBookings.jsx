import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookingService } from '../services/booking.service'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
}

const TABS = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'completed', label: 'Terminées' },
  { key: 'cancelled', label: 'Annulées' },
]

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetcher = user?.role === 'guide'
      ? bookingService.getGuideBookings
      : user?.role === 'agency'
        ? bookingService.getAgencyBookings
        : bookingService.getMyBookings

    fetcher({ limit: 50 })
      .then((res) => setBookings(res.data.data?.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.role])

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Mes réservations</h1>
          <p className="text-primary-200 mt-1">{bookings.length} réservation(s)</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6 pb-16">
        <div className="bg-white rounded-xl p-1 flex gap-1 overflow-x-auto shadow-sm border border-gray-100 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === tab.key ? 'bg-primary-500 text-white shadow-md' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Aucune réservation"
            description="Vous n'avez pas encore de réservation dans cette catégorie"
            actionLabel="Explorer le marketplace"
            actionTo="/marketplace"
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => (
              <Link
                key={booking.id}
                to={`/bookings/${booking.id}`}
                className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {booking.type?.replace('_', ' ')}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{booking.guide?.user?.name || booking.agency?.name || `Réservation #${booking.id}`}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(booking.startDate).toLocaleDateString('fr-FR')} - {booking.duration} {booking.durationUnit}(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600 text-lg">{booking.totalAmount?.toLocaleString()} Ar</p>
                    <svg className="w-5 h-5 text-gray-300 ml-auto mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
