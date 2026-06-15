export default function LoadingSpinner({ size = 'md', text = 'Chargement...' }) {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' }

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`} />
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  )
}
