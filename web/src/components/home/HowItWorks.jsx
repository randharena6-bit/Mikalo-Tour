import SectionTitle from '../common/SectionTitle'

const steps = [
  {
    number: '01',
    title: 'Créez votre compte',
    description: 'Inscrivez-vous gratuitement en quelques clics. Choisissez votre profil : voyageur, guide ou agence.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    number: '02',
    title: 'Planifiez avec l\'IA',
    description: 'Décrivez votre voyage idéal. L\'IA génère un itinéraire sur mesure avec budget et recommandations.',
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    number: '03',
    title: 'Réservez en confiance',
    description: 'Choisissez parmi nos guides certifiés et agences vérifiées. Paiement sécurisé, annulation flexible.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    number: '04',
    title: 'Explorez et partagez',
    description: 'Profitez de votre voyage, laissez des avis et partagez vos moments sur le réseau social touristique.',
    color: 'from-primary-600 to-secondary-600',
  },
]

const userTypes = [
  {
    title: 'Pour les voyageurs',
    items: [
      'Planification intelligente de voyage',
      'Réservation de guides certifiés',
      'Paiement sécurisé (Mobile Money & Carte)',
      'Traduction automatique des messages',
      'Carte interactive des services',
    ],
    gradient: 'from-primary-500 to-primary-700',
  },
  {
    title: 'Pour les guides',
    items: [
      'Profil professionnel avec badge certifié',
      'Calendrier de disponibilités',
      'Tableau de bord des revenus',
      'Mise en relation avec les agences',
      'QR Code professionnel unique',
    ],
    gradient: 'from-secondary-500 to-secondary-700',
  },
  {
    title: 'Pour les agences',
    items: [
      'Création de packs touristiques',
      'Gestion des réservations',
      'Partenariat avec des guides',
      'Statistiques et analyses IA',
      'Visibilité internationale',
    ],
    gradient: 'from-accent-500 to-accent-700',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Comment ça marche"
          title="Votre voyage en 4 étapes simples"
          description="De la planification à l'exploration, Mikalo Tour vous accompagne à chaque étape."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-gray-300" />
              )}
              <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                  <span className="text-white text-2xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${type.gradient}`} />
              <h3 className="text-xl font-bold text-gray-900 mb-6 mt-2">{type.title}</h3>
              <ul className="space-y-4">
                {type.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
