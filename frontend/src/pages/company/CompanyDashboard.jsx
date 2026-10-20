import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Clock3, CheckCircle2, FilePlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import CompanyLayout from './CompanyLayout'
import StatCard from '../../components/StatCard'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getRequests } from '../../services/resources'

export default function CompanyDashboard() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRequests().then(setRequests).finally(() => setLoading(false))
  }, [])

  if (loading) return <CompanyLayout><LoadingSpinner /></CompanyLayout>

  const pending = requests.filter((r) => r.status === 'pending').length
  const approved = requests.filter((r) => r.status === 'approved').length
  const completed = requests.filter((r) => r.status === 'completed').length

  return (
    <CompanyLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard icon={Clock3} label="Pending Requests" value={pending} />
          <StatCard icon={ClipboardList} label="Approved Requests" value={approved} />
          <StatCard icon={CheckCircle2} label="Completed Requests" value={completed} />
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Recent Requests</h2>
            <Link to="/company/new-request" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <FilePlus size={16} /> New Request
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
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
                    <td className="py-3 pr-4">{r.location}</td>
                    <td className="py-3 pr-4 capitalize text-muted">{r.shift}</td>
                    <td className="py-3 pr-4 text-muted">{r.number_of_guards}</td>
                    <td className="py-3 pr-4 text-muted">{r.duty_date}</td>
                    <td className="py-3"><Badge status={r.status} /></td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-muted">No requests yet. Submit your first one!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </CompanyLayout>
  )
}
