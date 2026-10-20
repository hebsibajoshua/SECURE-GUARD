import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, X, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getGuards, createGuard, deleteGuard } from '../../services/resources'

const empty = { full_name: '', phone: '', gender: 'male', experience_years: 0, id_proof_number: '', address: '' }

export default function AdminGuards() {
  const [guards, setGuards] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    getGuards().then(setGuards).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createGuard(form)
      toast.success('Guard added successfully')
      setShowForm(false)
      setForm(empty)
      load()
    } catch (err) {
      toast.error('Failed to add guard')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this guard?')) return
    try {
      await deleteGuard(id)
      toast.success('Guard removed')
      load()
    } catch {
      toast.error('Failed to remove guard')
    }
  }

  const filtered = guards.filter((g) => g.full_name.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5 w-full sm:w-72">
          <Search size={16} className="text-muted" />
          <input
            placeholder="Search guards..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted/60"
          />
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-medium whitespace-nowrap">
          <Plus size={16} /> Add Guard
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Phone</th>
                  <th className="pb-3 pr-4">Gender</th>
                  <th className="pb-3 pr-4">Experience</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id} className="border-b border-border/60 hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 font-medium">{g.full_name}</td>
                    <td className="py-3 pr-4 text-muted">{g.phone}</td>
                    <td className="py-3 pr-4 capitalize text-muted">{g.gender}</td>
                    <td className="py-3 pr-4 text-muted">{g.experience_years} yrs</td>
                    <td className="py-3 pr-4"><Badge status={g.status} /></td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleDelete(g.id)} className="text-muted hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted">No guards found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-semibold text-lg">Add New Guard</h3>
                <button onClick={() => setShowForm(false)} className="text-muted hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input required placeholder="Full Name" value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                <input required placeholder="Phone" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <input type="number" min="0" placeholder="Experience (yrs)" value={form.experience_years}
                    onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                    className="bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <input placeholder="ID Proof Number" value={form.id_proof_number}
                  onChange={(e) => setForm({ ...form, id_proof_number: e.target.value })}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                <textarea placeholder="Address" rows={2} value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
                <button type="submit" disabled={saving} className="w-full py-2.5 rounded-xl btn-primary font-medium text-sm disabled:opacity-60">
                  {saving ? 'Saving...' : 'Add Guard'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
