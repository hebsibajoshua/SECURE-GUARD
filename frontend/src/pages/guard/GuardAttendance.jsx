import { useEffect, useState } from 'react'
import GuardLayout from './GuardLayout'
import Card from '../../components/Card'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getAttendance } from '../../services/resources'

export default function GuardAttendance() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAttendance().then(setRecords).finally(() => setLoading(false))
  }, [])

  if (loading) return <GuardLayout><LoadingSpinner /></GuardLayout>

  return (
    <GuardLayout>
      <Card>
        <h2 className="font-display font-semibold text-lg mb-4">Attendance History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Company</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Check In</th>
                <th className="pb-3">Check Out</th>
              </tr>
            </thead>
            <tbody>
              {records.map((a) => (
                <tr key={a.id} className="border-b border-border/60 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4">{a.date}</td>
                  <td className="py-3 pr-4 text-muted">{a.company_name}</td>
                  <td className="py-3 pr-4 text-muted">{a.location}</td>
                  <td className="py-3 pr-4 text-muted">{a.check_in_time ? new Date(a.check_in_time).toLocaleTimeString() : '—'}</td>
                  <td className="py-3 text-muted">{a.check_out_time ? new Date(a.check_out_time).toLocaleTimeString() : '—'}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted">No attendance recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </GuardLayout>
  )
}
