import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerCompany } from '../services/auth'

const fields = [
  { name: 'company_name', label: 'Company Name', type: 'text' },
  { name: 'contact_person', label: 'Contact Person', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'address', label: 'Address', type: 'textarea' },
  { name: 'password', label: 'Password', type: 'password' },
]

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registerCompany(form)
      toast.success('Registration successful! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-5 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg glass rounded-2xl p-8 shadow-card"
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Shield size={20} />
          </div>
          <span className="font-display font-bold text-xl">SecureGuard</span>
        </Link>
        <h1 className="text-2xl font-display font-bold text-center mb-1">Create a company account</h1>
        <p className="text-muted text-center text-sm mb-8">Register to start submitting guard requests</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="text-sm text-muted mb-1.5 block">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  required rows={2} onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                />
              ) : (
                <input
                  type={f.type} required onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                />
              )}
            </div>
          ))}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl btn-primary font-medium disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account? <Link to="/login" className="text-secondary hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  )
}
