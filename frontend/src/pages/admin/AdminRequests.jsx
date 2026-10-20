import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Ban, UserPlus, CheckCheck } from 'lucide-react'
import AdminLayout from './AdminLayout'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  getRequests, approveRequest, rejectRequest, completeRequest, assignGuardToRequest, getGuards,
} from '../../services/resources'

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [guards, setGuards] = useState([])
  const [loading, setLoading] = useState(true)
  const [assignTarget, setAssignTarget] = useState(null)
  const [selectedGuard, setSelectedGuard] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([getRequests(), getGuards({ status: 'available' })])
      .then(([r, g]) => { setRequests(r); setGuards(g) })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const act = async (fn, id, successMsg) => {
    try {
      await fn(id)
      toast.success(successMsg)
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Action failed')
    }
  }

  const handleAssign = async () => {
    if (!selectedGuard) return toast.error('Select a guard first')
    try {
      await assignGuardToRequest(assignTarget.id, selectedGuard)
      toast.success('Guard assigned')
      setAssignTarget(null)
      setSelectedGuard('')
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to assign guard')
    }
  }

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>

  return (
    <AdminLayout>
      <Card>
        <h2 className="font-display font-semibold text-lg mb-4">Guard Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="pb-3 pr-4">Company</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Guards</th>
                <th className="pb-3 pr-4">Shift</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-border/60 hover:bg-white/5 transition-colors align-top">
                  <td className="py-3 pr-4 font-medium">{r.company_name}</td>
                  <td className="py-3 pr-4 text-muted">{r.location}</td>
                  <td className="py-3 pr-4 text-muted">
                    {r.assignments?.length || 0}/{r.number_of_guards}
                  </td>
                  <td className="py-3 pr-4 capitalize text-muted">{r.shift}</td>
                  <td className="py-3 pr-4 text-muted">{r.duty_date}</td>
                  <td className="py-3 pr-4"><Badge status={r.status} /></td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => act(approveRequest, r.id, 'Request approved')}
                            className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25" title="Approve">
                            <Check size={14} />
                          </button>
                          <button onClick={() => act(rejectRequest, r.id, 'Request rejected')}
                            className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25" title="Reject">
                            <Ban size={14} />
                          </button>
                        </>
                      )}
                      {(r.status === 'pending' || r.status === 'approved') && r.assignments.length < r.number_of_guards && (
                        <button onClick={() => setAssignTarget(r)}
                          className="p-1.5 rounded-lg bg-primary/15 text-primary hover:bg-primary/25" title="Assign Guard">
                          <UserPlus size={14} />
                        </button>
                      )}
                      {r.status === 'approved' && (
                        <button onClick={() => act(completeRequest, r.id, 'Request marked complete')}
                          className="p-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25" title="Mark Complete">
                          <CheckCheck size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-muted">No requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {assignTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
            onClick={() => setAssignTarget(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-lg">Assign Guard</h3>
                <button onClick={() => setAssignTarget(null)} className="text-muted hover:text-white"><X size={20} /></button>
              </div>
              <p className="text-sm text-muted mb-4">Request #{assignTarget.id} — {assignTarget.location}</p>
              <select value={selectedGuard} onChange={(e) => setSelectedGuard(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary mb-4">
                <option value="">Select an available guard</option>
                {guards.map((g) => (
                  <option key={g.id} value={g.id}>{g.full_name} ({g.gender}, {g.experience_years} yrs)</option>
                ))}
              </select>
              <button onClick={handleAssign} className="w-full py-2.5 rounded-xl btn-primary font-medium text-sm">
                Assign
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
