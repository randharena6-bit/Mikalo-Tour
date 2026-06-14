const footerLinks = {
  plateforme: [
    { label: 'Accueil', href: '#' },
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Tarifs', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  voyageurs: [
    { label: 'Rechercher un guide', href: '#' },
    { label: 'Planifier un voyage', href: '#' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'Avis', href: '#' },
  ],
  professionnels: [
    { label: 'Devenir guide', href: '#' },
    { label: 'Inscrire mon agence', href: '#' },
    { label: 'Espace partenaire', href: '#' },
    { label: 'Centre d\'aide', href: '#' },
  ],
  legal: [
    { label: 'Conditions d\'utilisation', href: '#' },
    { label: 'Politique de confidentialité', href: '#' },
    { label: 'Mentions légales', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl">
                Mikalo <span className="text-primary-500">Tour</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              La plateforme intelligente qui connecte voyageurs, guides et agences pour 
              découvrir Madagascar autrement. Réservez, planifiez et explorez en toute 
              simplicité.
            </p>
            <div className="flex gap-4 mt-6">
              {['facebook', 'instagram', 'twitter', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
                  aria-label={social}
                >
                  <span className="text-xs font-medium uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
                {title === 'plateforme' ? 'Plateforme' :
                 title === 'voyageurs' ? 'Voyageurs' :
                 title === 'professionnels' ? 'Pros' :
                 'Légal'}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-gray-400 text-sm hover:text-primary-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Mikalo Tour. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-sm">
            Fièrement malgache {'🇲🇬'}
          </p>
        </div>
      </div>
    </footer>
  )
}
