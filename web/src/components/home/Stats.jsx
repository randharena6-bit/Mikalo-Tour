import { useState, useEffect, useRef } from 'react'

const stats = [
  { value: 500, suffix: '+', label: 'Guides certifiés' },
  { value: 100, suffix: '+', label: 'Agences partenaires' },
  { value: 2000, suffix: '+', label: 'Voyageurs satisfaits' },
  { value: 50, suffix: '+', label: 'Destinations couvertes' },
]

function AnimatedCounter({ end, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const counted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const startTime = Date.now()
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-extrabold text-white">
      {count}{suffix}
    </span>
  )
}

function StatCard({ value, suffix, label }) {
  return (
    <div className="text-center p-8">
      <AnimatedCounter end={value} suffix={suffix} />
      <p className="text-gray-300 text-lg mt-2 font-medium">{label}</p>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-700 via-primary-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Mikalo Tour en chiffres
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Une communauté grandissante qui transforme le tourisme à Madagascar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
