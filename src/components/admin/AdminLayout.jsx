import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import api from '../../api'
import './AdminLayout.css'

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '📦' },
  { to: '/admin/products/new', label: 'Add Product', icon: '➕' },
  { to: '/admin/products/bulk', label: 'Bulk Upload', icon: '📤' },
  { to: '/admin/vendors', label: 'Vendors', icon: '🏪' },
  { to: '/admin/customers', label: 'Customers', icon: '👥' },
  { to: '/admin/orders', label: 'Orders', icon: '📋' },
]

const vendorNav = [
  { to: '/vendor', label: 'Dashboard', icon: '📊', end: true },
  { to: '/vendor/products', label: 'My Products', icon: '📦' },
  { to: '/vendor/products/new', label: 'Add Product', icon: '➕' },
  { to: '/vendor/orders', label: 'Orders', icon: '📋' },
]

export default function AdminLayout() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
  }, [user, navigate])

  if (!user) return null

  const isAdmin = user.role === 'admin'
  const isVendor = user.role === 'vendor'
  const navItems = isAdmin ? adminNav : isVendor ? vendorNav : []

  return (
    <div className="admin-layout">
      <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>{isAdmin ? 'Admin Panel' : 'Vendor Panel'}</h2>
          <p className="admin-user-name">{user.name}</p>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-item">
            <span className="admin-nav-icon">🏠</span><span>Back to Store</span>
          </NavLink>
          <button onClick={() => { logout(); navigate('/') }} className="admin-logout-btn">
            🚪 Logout
          </button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
