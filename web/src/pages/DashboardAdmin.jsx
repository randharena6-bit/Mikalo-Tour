import { useState, useEffect } from 'react'
import { dashboardService } from '../services/dashboard.service'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function DashboardAdmin() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.admin()
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Chargement du tableau de bord administrateur..." />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-purple-200 mt-1">Gestion de la plateforme Mikalo Tour</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Utilisateurs', value: stats?.totalUsers || 0, color: 'bg-blue-500' },
            { label: 'Guides', value: stats?.totalGuides || 0, color: 'bg-green-500' },
            { label: 'Agences', value: stats?.totalAgencies || 0, color: 'bg-yellow-500' },
            { label: 'Réservations', value: stats?.totalBookings || 0, color: 'bg-purple-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3 text-white font-bold text-lg`}>
                {stat.value}
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {stats?.recentBookings?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Réservations récentes</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {stats.recentBookings.map((booking) => (
                <div key={booking.id} className="p-4 md:p-6">
                  <p className="font-semibold text-gray-900">{booking.tourist?.name || 'Voyageur'}</p>
                  <p className="text-sm text-gray-500">{booking.totalAmount?.toLocaleString()} Ar - {booking.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
