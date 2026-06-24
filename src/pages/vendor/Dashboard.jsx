import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

export default function VendorDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.vendor.dashboard()
      .then(res => setStats(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Loading dashboard...</div>
  if (error) return <div className="admin-error">{error}</div>
  if (!stats) return null

  const cards = [
    { label: 'Total Products', value: stats.totalProducts || 0, color: '#1D9E75', onClick: () => navigate('/vendor/products') },
    { label: 'Total Orders', value: stats.totalOrders || 0, color: '#534AB7', onClick: () => navigate('/vendor/orders') },
    { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: '#CC0C2C' },
    { label: 'Pending Orders', value: stats.pendingOrders || 0, color: '#E8B830', onClick: () => navigate('/vendor/orders') },
    { label: 'Out of Stock', value: stats.outOfStock || 0, color: '#E24B4A', onClick: () => navigate('/vendor/products') },
  ]

  return (
    <div className="admin-page">
      <div className="admin-header-bar">
        <h1>Vendor Dashboard</h1>
      </div>
      <div className="admin-stats-grid">
        {cards.map(card => (
          <div key={card.label} className="admin-stat-card" style={{ borderTop: `4px solid ${card.color}`, cursor: card.onClick ? 'pointer' : 'default' }}
            onClick={card.onClick}>
            <div className="admin-stat-value">{card.value}</div>
            <div className="admin-stat-label">{card.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 24, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-white)' }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, fontWeight: 600 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="admin-btn admin-btn-primary" onClick={() => navigate('/vendor/products/new')}>+ Add New Product</button>
            <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/vendor/products')}>Manage Products</button>
            <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/vendor/orders')}>View Orders</button>
          </div>
        </div>
        <div style={{ padding: 24, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-white)' }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, fontWeight: 600 }}>Business Summary</h3>
          <div style={{ fontSize: 14, lineHeight: 2.2 }}>
            <div><strong>Products Listed:</strong> {stats.totalProducts || 0}</div>
            <div><strong>Orders Received:</strong> {stats.totalOrders || 0}</div>
            <div><strong>Revenue Generated:</strong> ₹{(stats.totalRevenue || 0).toLocaleString()}</div>
            <div><strong>Pending Orders:</strong> {stats.pendingOrders || 0}</div>
            <div><strong>Out of Stock Items:</strong> {stats.outOfStock || 0}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
