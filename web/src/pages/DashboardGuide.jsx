import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookingService } from '../services/booking.service'
import { dashboardService } from '../services/dashboard.service'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function DashboardGuide() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dashboardService.guide().catch(() => null),
      bookingService.getGuideBookings({ limit: 10 }).catch(() => ({ data: { data: [] } })),
    ])
      .then(([statsRes, bookingsRes]) => {
        setStats(statsRes?.data?.data?.stats)
        setBookings(bookingsRes.data.data?.bookings || [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Chargement du tableau de bord..." />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord guide</h1>
            <p className="text-primary-200 mt-1">{user?.name}</p>
          </div>
          <Link to="/profile" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
            Modifier mon profil
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Revenus', value: `${(stats?.totalRevenue || 0).toLocaleString()} Ar`, color: 'bg-green-500' },
            { label: 'Réservations', value: stats?.totalBookings || 0, color: 'bg-blue-500' },
            { label: 'En cours', value: stats?.activeBookings || 0, color: 'bg-yellow-500' },
            { label: 'Note', value: `${stats?.averageRating || 0}/5`, color: 'bg-purple-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3 text-white font-bold text-lg`}>
                {typeof stat.value === 'number' ? stat.value : stat.value.split(' ')[0]}
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Link to="/marketplace" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900">Gérer mes circuits</h3>
            <p className="text-sm text-gray-500 mt-1">Créer et modifier vos circuits</p>
          </Link>
          <Link to="/marketplace" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900">Gérer mes activités</h3>
            <p className="text-sm text-gray-500 mt-1">Ajouter des activités</p>
          </Link>
          <Link to="/messages" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900">Messagerie</h3>
            <p className="text-sm text-gray-500 mt-1">Discuter avec les voyageurs</p>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Réservations récentes</h2>
          </div>
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Aucune réservation pour le moment</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <Link key={booking.id} to={`/bookings/${booking.id}`} className="flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900">{booking.tourist?.name || 'Voyageur'}</p>
                    <p className="text-sm text-gray-500 capitalize">{booking.type?.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">{booking.totalAmount?.toLocaleString()} Ar</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : booking.status === 'in_progress' ? 'bg-green-100 text-green-700' : booking.status === 'completed' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>
                      {booking.status}
                    </span>
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
