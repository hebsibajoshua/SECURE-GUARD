import { LayoutDashboard, FilePlus, ListChecks, UserCircle } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'

const navItems = [
  { to: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/company/new-request', label: 'New Request', icon: FilePlus },
  { to: '/company/my-requests', label: 'My Requests', icon: ListChecks },
  { to: '/company/profile', label: 'Profile', icon: UserCircle },
]

export default function CompanyLayout({ children }) {
  return (
    <DashboardLayout navItems={navItems} roleLabel="Company Portal">
      {children}
    </DashboardLayout>
  )
}
