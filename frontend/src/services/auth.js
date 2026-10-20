import api from './api'

export async function login(email, password) {
  const { data } = await api.post('/auth/login/', { email, password })
  localStorage.setItem('sg_access', data.access)
  localStorage.setItem('sg_refresh', data.refresh)
  localStorage.setItem('sg_user', JSON.stringify(data.user))
  return data.user
}

export async function registerCompany(payload) {
  const { data } = await api.post('/auth/register-company/', payload)
  return data
}

export function logout() {
  localStorage.removeItem('sg_access')
  localStorage.removeItem('sg_refresh')
  localStorage.removeItem('sg_user')
}

export function getCurrentUser() {
  const raw = localStorage.getItem('sg_user')
  return raw ? JSON.parse(raw) : null
}

export function isAuthenticated() {
  return !!localStorage.getItem('sg_access')
}
