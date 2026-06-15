import SectionTitle from '../common/SectionTitle'

const destinations = [
  {
    name: 'Nosy Be',
    tag: 'Île paradisiaque',
    description: 'Plages de sable blanc, eaux turquoise, ylang-ylang',
    image: '/images/NosyBe.jpeg',
    gradient: 'from-blue-500/80 to-cyan-600/80',
  },
  {
    name: 'Tsingy de Bemaraha',
    tag: 'Patrimoine UNESCO',
    description: 'Formations calcaires uniques, canyon et lémuriens',
    image: '/images/Tsingy.jpeg',
    gradient: 'from-amber-600/80 to-orange-700/80',
  },
  {
    name: 'Sainte-Marie',
    tag: 'Île aux baleines',
    description: 'Observation des baleines, plages sauvages, histoire pirate',
    image: '/images/7.jpeg',
    gradient: 'from-emerald-600/80 to-teal-700/80',
  },
  {
    name: 'Antananarivo',
    tag: 'Capitale',
    description: 'Collines, palais royaux, artisanat et gastronomie',
    image: '/images/Tana.jpg',
    gradient: 'from-rose-600/80 to-pink-700/80',
  },
  {
    name: 'Ifaty',
    tag: 'Plage & Récif',
    description: 'Plongée sous-marine, baobabs, lagons protégés',
    image: '/images/Ifaty.jpeg',
    gradient: 'from-sky-600/80 to-indigo-700/80',
  },
  {
    name: 'Ranomafana',
    tag: 'Parc national',
    description: 'Forêt tropicale, cascades, lémuriens dorés',
    image: '/images/Ranomafana.jpeg',
    gradient: 'from-lime-600/80 to-green-700/80',
  },
]

export default function Destinations() {
  return (
    <section id="destinations" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Destinations"
          title="Explorez Madagascar"
          description="Des plages paradisiaques aux parcs nationaux, découvrez les merveilles de la Grande Île."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${dest.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-br ${dest.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="absolute top-4 left-4">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {dest.tag}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 transform group-hover:translate-y-[-8px] transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">{dest.name}</h3>
                <p className="text-white/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {dest.description}
                </p>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-full text-sm shadow-lg hover:shadow-xl transition-shadow">
                  Découvrir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
