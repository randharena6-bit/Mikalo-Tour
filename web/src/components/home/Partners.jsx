import SectionTitle from '../common/SectionTitle'

const partners = [
  { name: 'Orange Money', category: 'Paiement Mobile' },
  { name: 'MVola', category: 'Paiement Mobile' },
  { name: 'Airtel Money', category: 'Paiement Mobile' },
  { name: 'PayPal', category: 'Paiement International' },
  { name: 'Visa', category: 'Paiement International' },
  { name: 'Mastercard', category: 'Paiement International' },
]

export default function Partners() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Partenaires"
          title="Moyens de paiement acceptés"
          description="Des solutions adaptées à tous les voyageurs, locaux comme internationaux."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-500 text-xs font-bold">{partner.name.charAt(0)}</span>
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">{partner.name}</h4>
              <p className="text-gray-500 text-xs mt-1">{partner.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
