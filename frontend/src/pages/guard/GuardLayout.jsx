import { LayoutDashboard, CalendarCheck, History, UserCircle } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'

const navItems = [
  { to: '/guard/dashboard', label: "Today's Duty", icon: LayoutDashboard, end: true },
  { to: '/guard/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/guard/profile', label: 'Profile', icon: UserCircle },
]

export default function GuardLayout({ children }) {
  return (
    <DashboardLayout navItems={navItems} roleLabel="Guard Portal">
      {children}
    </DashboardLayout>
  )
}
