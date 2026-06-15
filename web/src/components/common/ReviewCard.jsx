import StarRating from './StarRating'

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        <img
          src={review.reviewer?.avatar || '/images/default-avatar.png'}
          alt={review.reviewer?.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-900">{review.reviewer?.name || 'Anonyme'}</h4>
              <StarRating rating={review.rating} />
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {new Date(review.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">{review.comment}</p>
          {review.response && (
            <div className="mt-4 pl-4 border-l-2 border-primary-200 bg-primary-50 rounded-r-lg p-3">
              <p className="text-xs font-medium text-primary-600 mb-1">Réponse</p>
              <p className="text-sm text-gray-600">{review.response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
