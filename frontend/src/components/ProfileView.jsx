import { UserCircle, Mail, Phone, Shield } from 'lucide-react'
import Card from './Card'
import { getCurrentUser } from '../services/auth'

export default function ProfileView() {
  const user = getCurrentUser()
  return (
    <Card className="max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold">
          {(user?.first_name || user?.username || 'U')[0].toUpperCase()}
        </div>
        <div>
          <h2 className="font-display font-semibold text-xl">{user?.username}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/15 text-primary capitalize border border-primary/30">{user?.role}</span>
        </div>
      </div>
      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-3 text-muted">
          <Mail size={16} className="text-secondary" /> {user?.email}
        </div>
        <div className="flex items-center gap-3 text-muted">
          <Phone size={16} className="text-secondary" /> {user?.phone || 'Not provided'}
        </div>
        <div className="flex items-center gap-3 text-muted">
          <Shield size={16} className="text-secondary" /> Role: <span className="capitalize text-white">{user?.role}</span>
        </div>
      </div>
    </Card>
  )
}
