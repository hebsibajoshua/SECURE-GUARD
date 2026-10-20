import api from './api'

// Guards
export const getGuards = (params) => api.get('/guards/', { params }).then((r) => r.data)
export const createGuard = (payload) => api.post('/guards/', payload).then((r) => r.data)
export const updateGuard = (id, payload) => api.patch(`/guards/${id}/`, payload).then((r) => r.data)
export const deleteGuard = (id) => api.delete(`/guards/${id}/`)

// Companies
export const getCompanies = () => api.get('/companies/').then((r) => r.data)
export const updateCompany = (id, payload) => api.patch(`/companies/${id}/`, payload).then((r) => r.data)

// Requests
export const getRequests = () => api.get('/requests/').then((r) => r.data)
export const createRequest = (payload) => api.post('/requests/', payload).then((r) => r.data)
export const approveRequest = (id) => api.post(`/requests/${id}/approve/`).then((r) => r.data)
export const rejectRequest = (id) => api.post(`/requests/${id}/reject/`).then((r) => r.data)
export const completeRequest = (id) => api.post(`/requests/${id}/complete/`).then((r) => r.data)
export const assignGuardToRequest = (id, guardId) =>
  api.post(`/requests/${id}/assign_guard/`, { guard_id: guardId }).then((r) => r.data)

// Assignments
export const getMyAssignments = () => api.get('/requests/assignments/').then((r) => r.data)

// Attendance
export const getAttendance = () => api.get('/attendance/').then((r) => r.data)
export const checkIn = (assignmentId) => api.post('/attendance/check_in/', { assignment: assignmentId }).then((r) => r.data)
export const checkOut = (assignmentId) => api.post('/attendance/check_out/', { assignment: assignmentId }).then((r) => r.data)
