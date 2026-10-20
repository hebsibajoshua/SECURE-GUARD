import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Building2, MapPin, Calendar, Clock, LogIn, LogOut } from 'lucide-react'
import GuardLayout from './GuardLayout'
import Card from '../../components/Card'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getMyAssignments, getAttendance, checkIn, checkOut } from '../../services/resources'

export default function GuardDashboard() {
  const [assignments, setAssignments] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([getMyAssignments(), getAttendance()])
      .then(([a, att]) => { setAssignments(a); setAttendance(att) })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const todayStr = new Date().toISOString().slice(0, 10)
  const activeAssignments = assignments.filter((a) => a.status !== 'completed')

  const todaysRecord = (assignmentId) =>
    attendance.find((a) => a.assignment === assignmentId && a.date === todayStr)

  const handleCheckIn = async (id) => {
    setBusyId(id)
    try {
      await checkIn(id)
      toast.success('Checked in successfully')
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Check-in failed')
    } finally {
      setBusyId(null)
    }
  }

  const handleCheckOut = async (id) => {
    setBusyId(id)
    try {
      await checkOut(id)
      toast.success('Checked out successfully')
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Check-out failed')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <GuardLayout><LoadingSpinner /></GuardLayout>

  return (
    <GuardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
        <h2 className="font-display font-semibold text-lg">Your Duty Assignments</h2>

        {activeAssignments.length === 0 && (
          <Card><p className="text-muted text-center py-8">No active duty assigned right now.</p></Card>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          {activeAssignments.map((a) => {
            const record = todaysRecord(a.id)
            const isCheckedIn = !!record?.check_in_time
            const isCheckedOut = !!record?.check_out_time

            return (
              <Card key={a.id} className="relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Building2 size={16} className="text-secondary" /> {a.request_detail?.company_name || 'Assigned Duty'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <MapPin size={16} className="text-secondary" /> {a.request_detail?.location || '—'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Calendar size={16} className="text-secondary" /> {a.request_detail?.duty_date || '—'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted capitalize">
                    <Clock size={16} className="text-secondary" /> {a.request_detail?.shift || '—'} shift
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      disabled={isCheckedIn || busyId === a.id}
                      onClick={() => handleCheckIn(a.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl btn-primary text-sm font-medium disabled:opacity-40"
                    >
                      <LogIn size={16} /> Check In
                    </button>
                    <button
                      disabled={!isCheckedIn || isCheckedOut || busyId === a.id}
                      onClick={() => handleCheckOut(a.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:border-primary text-sm font-medium disabled:opacity-40 transition-colors"
                    >
                      <LogOut size={16} /> Check Out
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </motion.div>
    </GuardLayout>
  )
}
