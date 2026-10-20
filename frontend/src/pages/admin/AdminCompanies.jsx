import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'
import Card from '../../components/Card'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getCompanies, updateCompany } from '../../services/resources'

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCompanies().then(setCompanies).finally(() => setLoading(false))
  }, [])

  const toggleApproval = async (company) => {
    try {
      const updated = await updateCompany(company.id, { is_approved: !company.is_approved })
      setCompanies((current) => current.map((item) => item.id === updated.id ? updated : item))
      toast.success(updated.is_approved ? 'Company approved' : 'Company approval revoked')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update company approval')
    }
  }

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>

  return (
    <AdminLayout>
      <Card>
        <h2 className="font-display font-semibold text-lg mb-4">Registered Companies</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="pb-3 pr-4">Company</th>
                <th className="pb-3 pr-4">Contact Person</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Phone</th>
                <th className="pb-3">Address</th>
                <th className="pb-3 pr-4">Approval</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="border-b border-border/60 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 font-medium">{c.company_name}</td>
                  <td className="py-3 pr-4 text-muted">{c.contact_person}</td>
                  <td className="py-3 pr-4 text-muted">{c.email}</td>
                  <td className="py-3 pr-4 text-muted">{c.phone}</td>
                  <td className="py-3 text-muted">{c.address}</td>
                  <td className="py-3 pr-4 text-muted">{c.is_approved ? 'Approved' : 'Pending'}</td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleApproval(c)}
                      className="text-xs text-secondary hover:underline"
                    >
                      {c.is_approved ? 'Revoke' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-muted">No companies registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  )
}
