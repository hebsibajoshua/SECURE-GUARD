export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-t-primary border-transparent animate-spin" />
      </div>
      <span className="text-sm">{label}</span>
    </div>
  )
}
