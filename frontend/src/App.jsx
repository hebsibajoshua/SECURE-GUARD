import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminGuards from './pages/admin/AdminGuards'
import AdminCompanies from './pages/admin/AdminCompanies'
import AdminRequests from './pages/admin/AdminRequests'
import AdminAttendance from './pages/admin/AdminAttendance'
import AdminProfile from './pages/admin/AdminProfile'

import CompanyDashboard from './pages/company/CompanyDashboard'
import NewRequest from './pages/company/NewRequest'
import MyRequests from './pages/company/MyRequests'
import CompanyProfile from './pages/company/CompanyProfile'

import GuardDashboard from './pages/guard/GuardDashboard'
import GuardAttendance from './pages/guard/GuardAttendance'
import GuardProfile from './pages/guard/GuardProfile'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#121212', color: '#fff', border: '1px solid #2A2A2A' },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/guards" element={<ProtectedRoute allowedRoles={['admin']}><AdminGuards /></ProtectedRoute>} />
        <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['admin']}><AdminCompanies /></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={['admin']}><AdminRequests /></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute allowedRoles={['admin']}><AdminAttendance /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} />

        {/* Company */}
        <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/new-request" element={<ProtectedRoute allowedRoles={['company']}><NewRequest /></ProtectedRoute>} />
        <Route path="/company/my-requests" element={<ProtectedRoute allowedRoles={['company']}><MyRequests /></ProtectedRoute>} />
        <Route path="/company/profile" element={<ProtectedRoute allowedRoles={['company']}><CompanyProfile /></ProtectedRoute>} />

        {/* Guard */}
        <Route path="/guard/dashboard" element={<ProtectedRoute allowedRoles={['guard']}><GuardDashboard /></ProtectedRoute>} />
        <Route path="/guard/attendance" element={<ProtectedRoute allowedRoles={['guard']}><GuardAttendance /></ProtectedRoute>} />
        <Route path="/guard/profile" element={<ProtectedRoute allowedRoles={['guard']}><GuardProfile /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
