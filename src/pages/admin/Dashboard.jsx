import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.admin.dashboard()
      .then(res => setStats(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Loading dashboard...</div>
  if (error) return <div className="admin-error">{error}</div>
  if (!stats) return null

  const cards = [
    { label: 'Total Products', value: stats.totalProducts || 0, color: '#1D9E75', link: '/admin/products' },
    { label: 'Total Vendors', value: stats.totalVendors || 0, color: '#534AB7', link: '/admin/vendors' },
    { label: 'Total Customers', value: stats.totalUsers || 0, color: '#E8B830', link: '/admin/customers' },
    { label: 'Total Orders', value: stats.totalOrders || 0, color: '#CC0C2C', link: '/admin/orders' },
    { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: '#1D9E75' },
    { label: 'Pending Orders', value: stats.pendingOrders || 0, color: '#E24B4A', link: '/admin/orders' },
    { label: 'Out of Stock', value: stats.outOfStock || 0, color: '#6B7280', link: '/admin/products' },
    { label: 'Categories', value: stats.categoriesCount || 0, color: '#EF9F27' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-header-bar">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="admin-stats-grid">
        {cards.map(card => (
          <div key={card.label} className="admin-stat-card" style={{ borderTop: `4px solid ${card.color}`, cursor: card.link ? 'pointer' : 'default' }}
            onClick={() => card.link && navigate(card.link)}>
            <div className="admin-stat-value">{card.value}</div>
            <div className="admin-stat-label">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
