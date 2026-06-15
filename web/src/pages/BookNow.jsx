import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookingService } from '../services/booking.service'
import { guideService } from '../services/guide.service'
import { agencyService } from '../services/agency.service'
import { marketplaceService } from '../services/marketplace.service'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

const TYPE_LABELS = {
  guide: 'guide_hourly',
  agency: 'agency_package',
  circuit: 'guide_tour',
  activity: 'activity',
}

const DURATION_UNITS = [
  { value: 'hour', label: 'Heure(s)' },
  { value: 'day', label: 'Jour(s)' },
  { value: 'week', label: 'Semaine(s)' },
]

export default function BookNow() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [entity, setEntity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    bookingType: TYPE_LABELS[type] || 'guide_hourly',
    startDate: '',
    endDate: '',
    duration: 1,
    durationUnit: 'day',
    notes: '',
    totalAmount: 0,
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchers = {
      guide: () => guideService.getById(id),
      agency: () => agencyService.getById(id),
      circuit: () => marketplaceService.getCircuit(id),
      activity: () => marketplaceService.getActivity(id),
    }

    fetchers[type]?.()
      .then((res) => {
        const data = res.data.data
        setEntity(data)
        const rate = data.hourlyRate || data.dailyRate || data.price || 0
        setForm((prev) => ({ ...prev, totalAmount: rate }))
      })
      .catch(() => setError('Impossible de charger les informations'))
      .finally(() => setLoading(false))
  }, [type, id])

  const calculateTotal = (duration, unit, basePrice) => {
    const multipliers = { hour: 1, day: 8, week: 40 }
    return basePrice * duration * (multipliers[unit] || 1)
  }

  const handleDurationChange = (duration, unit) => {
    const basePrice = entity?.hourlyRate || entity?.dailyRate || entity?.price || 0
    setForm((prev) => ({
      ...prev,
      duration,
      durationUnit: unit,
      totalAmount: calculateTotal(duration, unit, basePrice),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.startDate) {
      setError('Veuillez choisir une date')
      return
    }
    setSubmitting(true)
    setError('')

    const payload = {
      type: form.bookingType,
      startDate: form.startDate,
      endDate: form.endDate || form.startDate,
      duration: form.duration,
      durationUnit: form.durationUnit,
      notes: form.notes,
      totalAmount: form.totalAmount,
    }

    if (type === 'guide' || type === 'circuit') payload.guideId = parseInt(id)
    if (type === 'agency') payload.agencyId = parseInt(id)
    if (type === 'activity') payload.activityId = parseInt(id)

    try {
      await bookingService.create(payload)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner text="Préparation de la réservation..." />

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Réserver</h1>
          <p className="text-primary-200 mt-1 capitalize">{type} • {entity?.name || entity?.user?.name || entity?.title}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {entity && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-8">
              <img
                src={entity.user?.avatar || entity.logo || '/images/default-avatar.png'}
                alt={entity.name || entity.user?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{entity.name || entity.user?.name || entity.title}</p>
                <p className="text-sm text-gray-500">{entity.specialty || entity.city || entity.location || entity.category}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin (optionnelle)</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                <input
                  type="number"
                  min={1}
                  value={form.duration}
                  onChange={(e) => handleDurationChange(parseInt(e.target.value) || 1, form.durationUnit)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                <select
                  value={form.durationUnit}
                  onChange={(e) => handleDurationChange(form.duration, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                >
                  {DURATION_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none"
                placeholder="Message pour le guide ou l'agence..."
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between text-lg">
                <span className="text-gray-600">Total estimé</span>
                <span className="font-bold text-primary-600 text-2xl">{form.totalAmount?.toLocaleString()} Ar</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Le prix final peut varier selon les options choisies</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 text-lg"
            >
              {submitting ? 'Réservation en cours...' : 'Confirmer la réservation'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
