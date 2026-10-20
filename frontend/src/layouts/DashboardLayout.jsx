import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Shield, Bell, Search } from 'lucide-react'
import { getCurrentUser, logout } from '../services/auth'

export default function DashboardLayout({ navItems, roleLabel, children }) {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar - desktop */}
      <motion.aside
        animate={{ width: open ? 248 : 76 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-sidebar border-r border-border sticky top-0 h-screen z-20"
      >
        <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <Shield size={18} className="text-white" />
          </div>
          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-display font-bold text-lg whitespace-nowrap"
              >
                SecureGuard
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors group relative ${
                  isActive
                    ? 'bg-primary/15 text-white'
                    : 'text-muted hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    />
                  )}
                  <item.icon size={18} className={isActive ? 'text-primary' : ''} />
                  {open && <span className="whitespace-nowrap">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut size={18} />
            {open && <span>Logout</span>}
          </button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-white"
        >
          <Menu size={12} />
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-border z-40 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Shield size={18} className="text-white" />
                  </div>
                  <span className="font-display font-bold text-lg">SecureGuard</span>
                </div>
                <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                        isActive ? 'bg-primary/15 text-white' : 'text-muted hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-border">
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-red-400 w-full">
                  <LogOut size={18} /><span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-muted" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider">{roleLabel}</p>
              <h1 className="font-display font-semibold text-lg">Welcome, {user?.first_name || user?.username || 'there'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 text-muted">
              <Search size={16} />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-40 placeholder:text-muted/60"
              />
            </div>
            <button className="relative text-muted hover:text-white">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-semibold">
              {(user?.first_name || user?.username || 'U')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
