import { Link } from 'react-router-dom'

export default function EmptyState({ icon, title = 'Aucun résultat', description, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {icon || (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-gray-500 text-center max-w-md">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
