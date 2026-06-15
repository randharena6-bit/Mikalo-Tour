import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { searchService } from '../services/search.service'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StarRating from '../components/common/StarRating'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(query)

  useEffect(() => {
    if (!query) return
    searchService.all({ q: query })
      .then((res) => setResults(res.data.data))
      .catch(() => setResults(null))
      .finally(() => setLoading(false))
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) setSearchParams({ q: searchInput.trim() })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Recherche</h1>
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher des guides, agences, circuits..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 outline-none shadow-lg"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
              Rechercher
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {!query ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Entrez un terme de recherche pour commencer</p>
          </div>
        ) : loading ? (
          <LoadingSpinner text="Recherche en cours..." />
        ) : !results ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Aucun résultat pour "{query}"</p>
            <p className="text-sm mt-2">Essayez avec d'autres termes</p>
          </div>
        ) : (
          <div className="space-y-12">
            {results.guides?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Guides ({results.guides.length})</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.guides.map((guide) => (
                    <Link key={guide.id} to={`/guides/${guide.id}`} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 mb-3">
                        <img src={guide.user?.avatar || '/images/default-avatar.png'} alt={guide.user?.name} className="w-14 h-14 rounded-full object-cover" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{guide.user?.name}</h3>
                          <p className="text-sm text-primary-500">{guide.specialty}</p>
                        </div>
                      </div>
                      <StarRating rating={parseFloat(guide.rating) || 0} size="sm" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.agencies?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Agences ({results.agencies.length})</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.agencies.map((agency) => (
                    <Link key={agency.id} to={`/agencies/${agency.id}`} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 mb-3">
                        <img src={agency.logo || '/images/default-avatar.png'} alt={agency.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{agency.name}</h3>
                          <p className="text-sm text-secondary-500">{agency.city}</p>
                        </div>
                      </div>
                      <StarRating rating={parseFloat(agency.rating) || 0} size="sm" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.circuits?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Circuits ({results.circuits.length})</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.circuits.map((circuit) => (
                    <Link key={circuit.id} to={`/circuits/${circuit.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="h-32 bg-primary-100 flex items-center justify-center">
                        <p className="font-semibold text-primary-600">{circuit.title}</p>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{circuit.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.activities?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Activités ({results.activities.length})</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.activities.map((activity) => (
                    <Link key={activity.id} to={`/activities/${activity.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="h-32 bg-secondary-100 flex items-center justify-center">
                        <p className="font-semibold text-secondary-600">{activity.title}</p>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
