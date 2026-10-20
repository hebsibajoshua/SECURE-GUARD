import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={hover ? { y: -3, boxShadow: '0 0 24px rgba(37,99,235,0.18)' } : {}}
      className={`bg-card border border-border rounded-2xl p-5 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
