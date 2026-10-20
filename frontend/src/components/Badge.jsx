const STYLES = {
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  approved: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/15 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  available: 'bg-green-500/15 text-green-400 border-green-500/30',
  assigned: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  inactive: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  on_duty: 'bg-secondary/15 text-secondary border-secondary/30',
}

export default function Badge({ status }) {
  const style = STYLES[status] || 'bg-gray-500/15 text-gray-400 border-gray-500/30'
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${style}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}
