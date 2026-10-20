import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, UserCog, Clock3 } from 'lucide-react'
import AdminLayout from './AdminLayout'
import StatCard from '../../components/StatCard'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getGuards, getRequests } from '../../services/resources'

export default function AdminDashboard() {
  const [guards, setGuards] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getGuards(), getRequests()])
      .then(([g, r]) => { setGuards(g); setRequests(r) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <AdminLayout><LoadingSpinner label="Loading dashboard..." /></AdminLayout>

  const total = guards.length
  const available = guards.filter((g) => g.status === 'available').length
  const assigned = guards.filter((g) => g.status === 'assigned').length
  const pending = requests.filter((r) => r.status === 'pending').length

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={Users} label="Total Guards" value={total} />
          <StatCard icon={UserCheck} label="Available Guards" value={available} />
          <StatCard icon={UserCog} label="Assigned Guards" value={assigned} />
          <StatCard icon={Clock3} label="Pending Requests" value={pending} />
        </div>

        <Card>
          <h2 className="font-display font-semibold text-lg mb-4">Recent Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="pb-3 pr-4">Company</th>
                  <th className="pb-3 pr-4">Location</th>
                  <th className="pb-3 pr-4">Shift</th>
                  <th className="pb-3 pr-4">Guards</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 6).map((r) => (
                  <tr key={r.id} className="border-b border-border/60 hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4">{r.company_name}</td>
                    <td className="py-3 pr-4 text-muted">{r.location}</td>
                    <td className="py-3 pr-4 capitalize text-muted">{r.shift}</td>
                    <td className="py-3 pr-4 text-muted">{r.number_of_guards}</td>
                    <td className="py-3 pr-4 text-muted">{r.duty_date}</td>
                    <td className="py-3"><Badge status={r.status} /></td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted">No requests yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </AdminLayout>
  )
}
