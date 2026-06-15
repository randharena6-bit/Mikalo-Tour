import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookingService } from '../services/booking.service'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
}

export default function DashboardTourist() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingService.getMyBookings({ limit: 10 })
      .then((res) => setBookings(res.data.data?.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Bonjour, {user?.name}</h1>
          <p className="text-primary-200 mt-1">Bienvenue sur votre tableau de bord</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Réservations', value: bookings.length, color: 'bg-blue-500' },
            { label: 'Confirmées', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-500' },
            { label: 'En cours', value: bookings.filter(b => b.status === 'in_progress').length, color: 'bg-yellow-500' },
            { label: 'Terminées', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-gray-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <span className="text-white font-bold text-lg">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Mes réservations</h2>
            <Link to="/marketplace" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              + Nouvelle réservation
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-4">Vous n'avez pas encore de réservation</p>
              <Link to="/marketplace" className="inline-block px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                Explorer les guides et agences
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <Link key={booking.id} to={`/bookings/${booking.id}`} className="flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 capitalize">
                        {booking.type?.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {booking.guide?.user?.name || booking.agency?.name || 'Réservation'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-primary-600">{booking.totalAmount?.toLocaleString()} Ar</p>
                    <svg className="w-5 h-5 text-gray-300 mt-1 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
