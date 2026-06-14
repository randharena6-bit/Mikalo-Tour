export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-80 h-80 bg-secondary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-200 mb-4">
          Prêt à commencer ?
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          Rejoignez la révolution du{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-accent-300">
            tourisme malgache
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
          Que vous soyez voyageur, guide ou agence, Mikalo Tour vous ouvre les portes 
          d&apos;une expérience touristique unique à Madagascar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-white text-primary-700 font-bold px-10 py-4 rounded-full text-base hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105">
            Créer un compte gratuit
          </button>
          <button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold px-10 py-4 rounded-full text-base hover:bg-white/20 transition-all duration-300">
            Devenir partenaire
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-white/60 text-sm">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Gratuit
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Sans engagement
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Paiement sécurisé
          </span>
        </div>
      </div>
    </section>
  )
}
