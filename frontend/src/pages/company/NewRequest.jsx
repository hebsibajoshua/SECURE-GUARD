import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import CompanyLayout from './CompanyLayout'
import Card from '../../components/Card'
import { createRequest } from '../../services/resources'

const initial = {
  location: '', number_of_guards: 1, shift: 'day', duty_date: '', gender_requirement: 'any', special_notes: '',
}

export default function NewRequest() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createRequest(form)
      toast.success('Request submitted successfully')
      navigate('/company/my-requests')
    } catch (err) {
      toast.error('Failed to submit request')
    } finally {
      setSaving(false)
    }
  }

  return (
    <CompanyLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="max-w-2xl">
          <h2 className="font-display font-semibold text-lg mb-1">Submit a Guard Request</h2>
          <p className="text-muted text-sm mb-6">Fill in the details below and the admin team will review it shortly.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted mb-1.5 block">Location</label>
              <input required value={form.location} onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Main Gate, Warehouse 3"
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted mb-1.5 block">Number of Guards</label>
                <input type="number" min="1" required value={form.number_of_guards}
                  onChange={(e) => update('number_of_guards', e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm text-muted mb-1.5 block">Shift</label>
                <select value={form.shift} onChange={(e) => update('shift', e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary">
                  <option value="day">Day</option>
                  <option value="night">Night</option>
                  <option value="rotational">Rotational</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted mb-1.5 block">Date</label>
                <input type="date" required value={form.duty_date} onChange={(e) => update('duty_date', e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm text-muted mb-1.5 block">Gender Requirement</label>
                <select value={form.gender_requirement} onChange={(e) => update('gender_requirement', e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary">
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted mb-1.5 block">Special Notes</label>
              <textarea rows={3} value={form.special_notes} onChange={(e) => update('special_notes', e.target.value)}
                placeholder="Anything the admin team should know..."
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </div>

            <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-3 rounded-xl btn-primary font-medium disabled:opacity-60">
              {saving ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </Card>
      </motion.div>
    </CompanyLayout>
  )
}
