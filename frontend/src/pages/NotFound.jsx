import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-5">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <ShieldAlert size={64} className="text-primary mx-auto mb-6" />
        <h1 className="font-display text-6xl font-bold mb-2">404</h1>
        <p className="text-muted mb-8">This area is restricted, or the page simply doesn't exist.</p>
        <Link to="/" className="px-6 py-3 rounded-xl btn-primary font-medium inline-block">Back to Home</Link>
      </motion.div>
    </div>
  )
}
