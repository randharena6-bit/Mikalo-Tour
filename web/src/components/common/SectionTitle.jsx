export default function SectionTitle({ subtitle, title, description, light = false }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      {subtitle && (
        <p className={`text-sm uppercase tracking-widest font-semibold mb-3 ${light ? 'text-primary-300' : 'text-primary-500'}`}>
          {subtitle}
        </p>
      )}
      {title && (
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${light ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
      )}
      {description && (
        <p className={`mt-4 text-lg ${light ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
