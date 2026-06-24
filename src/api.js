const API_BASE = 'http://localhost:5000/api'
const IMAGE_BASE = 'http://localhost:5000'

export function resolveImage(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return IMAGE_BASE + url
}

function getToken() {
  try {
    const state = JSON.parse(localStorage.getItem('samriddhi_state') || '{}')
    return state.user?.token || null
  } catch { return null }
}

async function request(endpoint, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

async function uploadFile(file) {
  const token = getToken()
  const formData = new FormData()
  formData.append('image', file)
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', headers, body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data
}

async function uploadFiles(files) {
  const token = getToken()
  const formData = new FormData()
  files.forEach(f => formData.append('images', f))
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}/upload/multiple`, { method: 'POST', headers, body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data
}

export const api = {
  // Public
  products: (params) => request(`/products?${new URLSearchParams(params || {})}`),
  product: (slug) => request(`/products/${slug}`),
  productById: (id) => request(`/products/id/${id}`),
  categories: () => request('/categories'),
  vendors: (params) => request(`/vendors?${new URLSearchParams(params || {})}`),
  vendor: (slug) => request(`/vendors/${slug}`),
  reviews: (params) => request(`/reviews?${new URLSearchParams(params || {})}`),
  orders: {
    list: (params) => request(`/orders?${new URLSearchParams(params || {})}`),
    create: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
    get: (id) => request(`/orders/${id}`),
  },

  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  sendOtp: (email) =>
    request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOtp: (email, otp, extra = {}) =>
    request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp, ...extra }) }),

  // Admin
  admin: {
    dashboard: () => request('/admin/dashboard'),
    products: (params) => request(`/admin/products?${new URLSearchParams(params)}`),
    product: (id) => request(`/admin/products/${id}`),
    createProduct: (data) =>
      request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id, data) =>
      request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id) =>
      request(`/admin/products/${id}`, { method: 'DELETE' }),
    bulkProducts: (items) =>
      request('/admin/products/bulk', { method: 'POST', body: JSON.stringify({ items }) }),
    vendors: () => request('/admin/vendors'),
    vendor: (id) => request(`/admin/vendors/${id}`),
    updateVendor: (id, data) =>
      request(`/admin/vendors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    orders: (params) => request(`/admin/orders?${new URLSearchParams(params)}`),
    updateOrderStatus: (id, status) =>
      request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    customers: () => request('/admin/customers'),
    customer: (id) => request(`/admin/customers/${id}`),
    customerOrders: (id) => request(`/admin/customers/${id}/orders`),
  },

  // Vendor Dashboard
  vendor: {
    dashboard: () => request('/vendor-dashboard/dashboard'),
    products: (params) => request(`/vendor-dashboard/products?${new URLSearchParams(params)}`),
    createProduct: (data) =>
      request('/vendor-dashboard/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id, data) =>
      request(`/vendor-dashboard/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id) =>
      request(`/vendor-dashboard/products/${id}`, { method: 'DELETE' }),
    orders: (params) => request(`/vendor-dashboard/orders?${new URLSearchParams(params)}`),
    updateOrderStatus: (id, status) =>
      request(`/vendor-dashboard/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  upload: {
    single: uploadFile,
    multiple: uploadFiles,
  },

  razorpay: {
    key: () => request('/razorpay/key'),
    createOrder: (amount) =>
      request('/razorpay/create-order', { method: 'POST', body: JSON.stringify({ amount }) }),
  },
}

export default api
