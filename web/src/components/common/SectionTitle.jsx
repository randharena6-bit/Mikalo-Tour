export default function SectionTitle({ subtitle, title, description, light = false }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      {subtitle && (
        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3">
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ${
        light ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg leading-relaxed ${
          light ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {description}
        </p>
      )}
    </div>
  )
}
