import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

export default function StatCard({ icon: Icon, label, value, accent = 'primary' }) {
  const count = useCountUp(value)
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
      className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
      <div className="relative z-10">
        <p className="text-muted text-xs uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-display font-bold text-white">{count}</p>
      </div>
      <div className="relative z-10 w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
        {Icon && <Icon size={20} />}
      </div>
    </motion.div>
  )
}
