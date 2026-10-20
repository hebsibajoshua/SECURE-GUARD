import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Shield, ShieldCheck, Users, ClipboardList, Clock, BarChart3,
  ArrowRight, Menu, X, CheckCircle2, Mail, Phone, MapPin,
} from 'lucide-react'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

const features = [
  { icon: Users, title: 'Guard Management', desc: 'Maintain a complete roster of guards with availability, experience, and verification details.' },
  { icon: ClipboardList, title: 'Request Handling', desc: 'Companies raise duty requests in seconds; admins review and approve with one click.' },
  { icon: ShieldCheck, title: 'Smart Assignment', desc: 'Match available guards to client requests based on shift, gender preference, and location.' },
  { icon: Clock, title: 'Attendance Tracking', desc: 'Guards check in and out digitally, building an accurate, timestamped duty record.' },
  { icon: BarChart3, title: 'Live Dashboards', desc: 'Role-based dashboards give every user the numbers that matter to them, instantly.' },
  { icon: Shield, title: 'Secure Access', desc: 'JWT-based authentication keeps every account and every role properly isolated.' },
]

const steps = [
  { title: 'Company Submits a Request', desc: 'A client logs in and raises a guard request with location, shift, and headcount.' },
  { title: 'Admin Reviews & Assigns', desc: 'The admin checks availability and assigns the right guards to the job.' },
  { title: 'Guard Checks In', desc: 'On the day of duty, the guard checks in and out directly from their dashboard.' },
  { title: 'Duty Marked Complete', desc: 'Attendance is recorded automatically and the request is closed out.' },
]

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-bg text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/70 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Shield size={16} />
            </div>
            <span className="font-display font-bold text-lg">SecureGuard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm rounded-lg border border-border hover:border-primary transition-colors">Login</Link>
            <Link to="/register" className="px-4 py-2 text-sm rounded-lg btn-primary">Get Started</Link>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-3 text-sm text-muted border-t border-border bg-bg">
            <a href="#features" onClick={() => setMenuOpen(false)} className="pt-3">Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1 text-center px-4 py-2 rounded-lg border border-border">Login</Link>
              <Link to="/register" className="flex-1 text-center px-4 py-2 rounded-lg btn-primary">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/60 to-bg" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px]" />

        {/* scanning line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-32 bg-gradient-to-b from-transparent via-primary/15 to-transparent animate-scan" />
        </div>

        {/* floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-secondary/60"
            style={{ left: `${(i * 9 + 5) % 100}%`, top: `${(i * 17 + 10) % 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial="hidden" animate="visible" custom={0} variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulseGlow" />
              Built for security agencies & guard operations
            </motion.div>
            <motion.h1
              initial="hidden" animate="visible" custom={1} variants={fadeUp}
              className="font-display text-5xl md:text-6xl font-bold leading-tight mb-2"
            >
              <span className="text-gradient">SecureGuard</span>
            </motion.h1>
            <motion.p
              initial="hidden" animate="visible" custom={2} variants={fadeUp}
              className="text-xl text-secondary font-medium mb-5"
            >
              Security Guard Management System
            </motion.p>
            <motion.p
              initial="hidden" animate="visible" custom={3} variants={fadeUp}
              className="text-muted text-lg mb-8 max-w-lg"
            >
              Helping security agencies efficiently manage guard assignments, client requests, attendance, and daily operations — all from one dashboard.
            </motion.p>
            <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="flex flex-wrap gap-4">
              <Link to="/register" className="px-6 py-3 rounded-xl btn-primary font-medium flex items-center gap-2">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-xl border border-border hover:border-primary transition-colors font-medium">
                Login
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative hidden md:flex items-center justify-center"
          >
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="relative w-72 h-72 rounded-full glass flex items-center justify-center shadow-glow">
                <div className="absolute inset-4 rounded-full border border-primary/30" />
                <div className="absolute inset-10 rounded-full border border-primary/20" />
                <Shield size={120} strokeWidth={1.2} className="text-primary drop-shadow-[0_0_20px_rgba(37,99,235,0.6)]" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-5 md:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-14">
            <p className="text-secondary text-sm font-medium tracking-wider uppercase mb-2">Features</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Everything your operations team needs</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                whileHover={{ y: -6 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors hover:shadow-glow"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-4">
                  <f.icon size={20} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-5 md:px-8 border-t border-border bg-gradient-to-b from-transparent to-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-14">
            <p className="text-secondary text-sm font-medium tracking-wider uppercase mb-2">Workflow</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">How It Works</h2>
          </motion.div>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="flex gap-5 items-start bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-10 h-10 shrink-0 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-display font-semibold text-primary">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-muted text-sm">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-5 md:px-8 border-t border-border">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
            <p className="text-secondary text-sm font-medium tracking-wider uppercase mb-2">About</p>
            <h2 className="font-display text-3xl font-bold mb-4">Built for the realities of guard operations</h2>
            <p className="text-muted leading-relaxed mb-6">
              SecureGuard was designed as a focused tool for security agencies to coordinate guards, clients, and duty schedules without juggling spreadsheets and phone calls. Every role gets exactly the view they need — nothing more.
            </p>
            <ul className="space-y-3">
              {['Role-based dashboards for Admin, Company & Guard', 'Real-time request and assignment tracking', 'Digital attendance with check-in / check-out'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm text-muted">
                  <CheckCircle2 size={18} className="text-secondary shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
            className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="grid grid-cols-2 gap-6 relative z-10">
              {[['3', 'User Roles'], ['6', 'Core Modules'], ['100%', 'Role Isolation'], ['24/7', 'Duty Tracking']].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl font-bold text-gradient">{num}</p>
                  <p className="text-muted text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-5 md:px-8 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
            <p className="text-secondary text-sm font-medium tracking-wider uppercase mb-2">Contact</p>
            <h2 className="font-display text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-muted mb-10">Create a company account or log in to start managing your guard operations today.</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted mb-10">
              <span className="flex items-center gap-2"><Mail size={16} className="text-secondary" /> support@secureguard.app</span>
              <span className="flex items-center gap-2"><Phone size={16} className="text-secondary" /> +91 98765 43210</span>
              <span className="flex items-center gap-2"><MapPin size={16} className="text-secondary" /> Pune, India</span>
            </div>
            <Link to="/register" className="px-7 py-3 rounded-xl btn-primary font-medium inline-flex items-center gap-2">
              Get Started <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-5 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <span className="font-display font-semibold">SecureGuard</span>
          </div>
          <p className="text-muted text-sm">College Mini Project — Security Guard Management System</p>
        </div>
      </footer>
    </div>
  )
}
