import { useEffect, useState } from 'react'
import CompanyLayout from './CompanyLayout'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getRequests } from '../../services/resources'

const TABS = ['all', 'pending', 'approved', 'completed', 'rejected']

export default function MyRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')

  useEffect(() => {
    getRequests().then(setRequests).finally(() => setLoading(false))
  }, [])

  const filtered = tab === 'all' ? requests : requests.filter((r) => r.status === tab)

  return (
    <CompanyLayout>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm capitalize whitespace-nowrap border transition-colors ${
              tab === t ? 'bg-primary/15 text-primary border-primary/40' : 'border-border text-muted hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="pb-3 pr-4">Location</th>
                  <th className="pb-3 pr-4">Shift</th>
                  <th className="pb-3 pr-4">Guards</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Assigned</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4">{r.location}</td>
                    <td className="py-3 pr-4 capitalize text-muted">{r.shift}</td>
                    <td className="py-3 pr-4 text-muted">{r.number_of_guards}</td>
                    <td className="py-3 pr-4 text-muted">{r.duty_date}</td>
                    <td className="py-3 pr-4 text-muted">
                      {r.assignments?.length ? r.assignments.map((a) => a.guard_detail?.full_name).join(', ') : '—'}
                    </td>
                    <td className="py-3"><Badge status={r.status} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted">No requests in this category.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </CompanyLayout>
  )
}
