import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { guideService } from '../services/guide.service'
import { agencyService } from '../services/agency.service'
import { marketplaceService } from '../services/marketplace.service'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StarRating from '../components/common/StarRating'

const TABS = [
  { key: 'guides', label: 'Guides' },
  { key: 'agencies', label: 'Agences' },
  { key: 'circuits', label: 'Circuits' },
  { key: 'activities', label: 'Activités' },
]

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState('guides')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = search ? { search } : {}

    const fetchers = {
      guides: () => guideService.list(params),
      agencies: () => agencyService.list(params),
      circuits: () => marketplaceService.listCircuits(params),
      activities: () => marketplaceService.listActivities(params),
    }

    fetchers[activeTab]()
      .then((res) => setData(res.data.data?.[activeTab] || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [activeTab, search])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Marketplace</h1>
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">
            Trouvez le guide parfait, l'agence idéale ou l'activité qui vous correspond
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-1 flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key ? 'bg-primary-500 text-white shadow-md' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="relative mb-8">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={`Rechercher parmi les ${TABS.find(t => t.key === activeTab)?.label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Aucun résultat trouvé</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'guides' && data.map((item) => (
              <Link key={item.id} to={`/guides/${item.id}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={item.user?.avatar || '/images/default-avatar.png'} alt={item.user?.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">{item.user?.name}</h3>
                      <p className="text-sm text-primary-500 font-medium">{item.specialty || 'Guide touristique'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.bio || 'Aucune description'}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <StarRating rating={parseFloat(item.rating) || 0} size="sm" />
                    </span>
                    <span>{item.certified ? '✅ Certifié' : '⏳ En cours'}</span>
                  </div>
                  {item.languages?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.languages.map((lang) => (
                        <span key={lang} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{lang}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}

            {activeTab === 'agencies' && data.map((item) => (
              <Link key={item.id} to={`/agencies/${item.id}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={item.logo || '/images/default-avatar.png'} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                      <p className="text-sm text-primary-500 font-medium">{item.city || 'Madagascar'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description || 'Aucune description'}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <StarRating rating={parseFloat(item.rating) || 0} size="sm" />
                    </span>
                    <span>{item._count?.guides || 0} guides</span>
                  </div>
                </div>
              </Link>
            ))}

            {activeTab === 'circuits' && (
              data.map((item) => (
                <Link key={item.id} to={`/circuits/${item.id}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="h-40 bg-gradient-to-br from-primary-400 to-primary-600 relative overflow-hidden">
                    {item.images?.[0] && (
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-white font-semibold text-lg">{item.title}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-semibold text-primary-600">
                      {item.price?.toLocaleString()} Ar
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span>📍 {item.location || 'Madagascar'}</span>
                      <span>⏱ {item.duration} {item.durationUnit}</span>
                      <span>📊 {item.difficulty}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}

            {activeTab === 'activities' && (
              data.map((item) => (
                <Link key={item.id} to={`/activities/${item.id}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="h-40 bg-gradient-to-br from-secondary-400 to-secondary-600 relative overflow-hidden">
                    {item.images?.[0] && (
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-white font-semibold text-lg">{item.title}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-semibold text-secondary-600">
                      {item.price?.toLocaleString()} Ar
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span>🏷 {item.category}</span>
                      <span>⏱ {item.duration} {item.durationUnit}</span>
                      {item.location && <span>📍 {item.location}</span>}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
