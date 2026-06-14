import { useState } from 'react'
import SectionTitle from '../common/SectionTitle'

const testimonials = [
  {
    name: 'Rakoto H.',
    role: 'Voyageur - France',
    avatar: 'R',
    avatarBg: 'from-primary-400 to-primary-600',
    content: 'Grâce à Mikalo Tour, j\'ai pu organiser mon voyage à Nosy Be en un clic. L\'IA m\'a suggéré un itinéraire parfait et j\'ai trouvé un guide exceptionnel. Je recommande à 100% !',
    rating: 5,
  },
  {
    name: 'Mialy R.',
    role: 'Guide certifié - Antananarivo',
    avatar: 'M',
    avatarBg: 'from-secondary-400 to-secondary-600',
    content: 'Cette plateforme a changé ma vie professionnelle. Je reçois des réservations chaque semaine et le tableau de bord me permet de gérer mon agenda facilement. Merci Mikalo Tour !',
    rating: 5,
  },
  {
    name: 'Jean-Pierre D.',
    role: 'Voyageur - Belgique',
    avatar: 'J',
    avatarBg: 'from-accent-400 to-accent-600',
    content: 'La traduction automatique est géniale ! Mon guide parlait malagasy et je recevais tout en français. Une expérience fluide et authentique. Madagascar est magnifique.',
    rating: 5,
  },
  {
    name: 'Sarah B.',
    role: 'Voyageuse - Canada',
    avatar: 'S',
    avatarBg: 'from-purple-400 to-purple-600',
    content: 'J\'ai adoré la fonctionnalité de planification IA. J\'ai donné mon budget et mes préférences, et l\'itinéraire était parfait. Les recommandations d\'hôtels et de guides étaient top !',
    rating: 5,
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Témoignages"
          title="Ce que disent nos utilisateurs"
          description="Des voyageurs et professionnels partagent leur expérience avec Mikalo Tour."
        />

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gray-50 rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="absolute top-8 left-8 text-6xl text-primary-200 font-serif leading-none">
              &ldquo;
            </div>

            <div className="relative">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic">
                {testimonials[active].content}
              </p>

              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonials[active].avatarBg} flex items-center justify-center text-white font-bold text-xl`}>
                  {testimonials[active].avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonials[active].name}</h4>
                  <p className="text-gray-500 text-sm">{testimonials[active].role}</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === active
                    ? 'bg-primary-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
