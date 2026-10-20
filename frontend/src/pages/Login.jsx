import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md glass rounded-2xl p-8 shadow-card"
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Shield size={20} />
          </div>
          <span className="font-display font-bold text-xl">SecureGuard</span>
        </Link>

        <h1 className="text-2xl font-display font-bold text-center mb-1">Welcome back</h1>
        <p className="text-muted text-center text-sm mb-8">Login to access your dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted mb-1.5 block">Email</label>
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
              <Mail size={18} className="text-muted" />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="bg-transparent outline-none w-full text-sm placeholder:text-muted/50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted mb-1.5 block">Password</label>
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
              <Lock size={18} className="text-muted" />
              <input
                type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent outline-none w-full text-sm placeholder:text-muted/50"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-muted">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted cursor-pointer">
              <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="accent-primary" />
              Remember me
            </label>
            <a href="#" className="text-secondary hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl btn-primary font-medium disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          New company? <Link to="/register" className="text-secondary hover:underline">Register here</Link>
        </p>

        <div className="mt-6 pt-6 border-t border-border text-xs text-muted/70 text-center space-y-1">
          <p>Demo logins (after running seed_data):</p>
          <p>admin@secureguard.com / admin123</p>
          <p>company@secureguard.com / company123</p>
          <p>guard@secureguard.com / guard123</p>
        </div>
      </motion.div>
    </div>
  )
}
