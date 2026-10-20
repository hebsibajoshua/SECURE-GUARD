import { LayoutDashboard, Users, Building2, ClipboardList, CalendarCheck, UserCircle } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/guards', label: 'Guards', icon: Users },
  { to: '/admin/companies', label: 'Companies', icon: Building2 },
  { to: '/admin/requests', label: 'Requests', icon: ClipboardList },
  { to: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/admin/profile', label: 'Profile', icon: UserCircle },
]

export default function AdminLayout({ children }) {
  return (
    <DashboardLayout navItems={navItems} roleLabel="Admin Panel">
      {children}
    </DashboardLayout>
  )
}
