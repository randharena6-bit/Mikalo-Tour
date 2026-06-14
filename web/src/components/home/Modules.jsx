import SectionTitle from '../common/SectionTitle'

const modules = [
  {
    emoji: '🤖',
    title: 'IA de Planification',
    desc: 'Itinéraire complet généré par IA selon votre budget et préférences',
  },
  {
    emoji: '🔍',
    title: 'Recherche Intelligente',
    desc: 'Filtres avancés par région, budget, langue, activité',
  },
  {
    emoji: '📅',
    title: 'Réservation',
    desc: 'Guide à l\'heure, à la journée, circuit complet ou pack agence',
  },
  {
    emoji: '💬',
    title: 'Messagerie & Traduction',
    desc: 'Communication multilingue avec traduction automatique IA',
  },
  {
    emoji: '📱',
    title: 'Réseau Social',
    desc: 'Publications, stories, likes et partages entre voyageurs',
  },
  {
    emoji: '📇',
    title: 'QR Code Pro',
    desc: 'Carte de visite digitale pour guides et agences certifiés',
  },
  {
    emoji: '⭐',
    title: 'Système d\'Avis',
    desc: 'Notation 5 étoiles pour guides, agences, activités et circuits',
  },
  {
    emoji: '📊',
    title: 'Tableau de Bord',
    desc: 'Statistiques, revenus, réservations pour guides et agences',
  },
  {
    emoji: '🤝',
    title: 'Partenariat Guide-Agence',
    desc: 'Recrutement, affectation et collaboration entre pros',
  },
  {
    emoji: '💳',
    title: 'Paiement Multi',
    desc: 'MVola, Orange Money, Visa, Mastercard, PayPal',
  },
  {
    emoji: '🗺️',
    title: 'Carte Interactive',
    desc: 'Guides, agences, hôtels et sites sur une carte dynamique',
  },
  {
    emoji: '📈',
    title: 'Analyse IA',
    desc: 'Prévisions, tendances et recommandations personnalisées',
  },
]

export default function Modules() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Modules"
          title="12 modules pour une expérience complète"
          description="De l'authentification à l'analyse IA, chaque module est conçu pour enrichir votre expérience."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {modules.map((mod, index) => (
            <div
              key={index}
              className="group bg-gray-50 rounded-xl p-5 hover:bg-gradient-to-br hover:from-primary-500 hover:to-primary-700 transition-all duration-300 cursor-default"
            >
              <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform duration-300">
                {mod.emoji}
              </span>
              <h4 className="font-bold text-sm text-gray-900 group-hover:text-white transition-colors mb-1">
                {mod.title}
              </h4>
              <p className="text-xs text-gray-600 group-hover:text-white/80 transition-colors leading-relaxed">
                {mod.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
