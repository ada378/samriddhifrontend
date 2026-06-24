import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Card from '../common/Card'

export default function Dashboard() {
  const { user, orders, cart, wishlist } = useApp()

  const stats = useMemo(() => ({
    totalOrders: orders.length,
    totalSpent: orders.reduce((s, o) => s + (o.total || 0), 0),
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    savedVendors: 5,
    wishlistCount: wishlist.length,
  }), [orders, wishlist])

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders])

  const profileCompletion = useMemo(() => {
    let score = 0
    if (user?.name) score += 20
    if (user?.email) score += 20
    if (user?.phone) score += 20
    if (user?.businessName) score += 20
    if (user?.gstin) score += 20
    return score
  }, [user])

  const summaryCards = [
    { label: 'Total Orders', value: stats.totalOrders, color: 'var(--primary)', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
    { label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString()}`, color: 'var(--success)', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: 'var(--warning)', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { label: 'Saved Vendors', value: stats.savedVendors, color: 'var(--info)', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
    { label: 'Wishlist', value: stats.wishlistCount, color: 'var(--danger)', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
  ]

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem' }}>Welcome, {user?.name || 'Guest'} 👋</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Here's your account overview</p>
        </div>
        <Link to="/account" style={{ textDecoration: 'none' }}>
          <span className="btn btn-secondary btn-sm">Edit Profile</span>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
        {summaryCards.map((card, i) => (
          <Card key={i} padding="var(--space-lg)" hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: `${card.color}15`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2" strokeLinecap="round">
                  <path d={card.icon} />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>{card.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{card.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
        <Card padding="var(--space-xl)">
          <h5 style={{ marginBottom: 'var(--space-lg)', fontSize: '1rem' }}>Quick Actions</h5>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Browse Products', path: '/', icon: 'M16 11V7a4 4 0 0 0-8 0v4' },
              { label: 'My Orders', path: '/orders', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
              { label: 'Wishlist', path: '/wishlist', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
              { label: 'Contact Support', path: '/support', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
            ].map((action, i) => (
              <Link key={i} to={action.path} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500,
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-light)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"><path d={action.icon} /></svg>
                {action.label}
              </Link>
            ))}
          </div>
        </Card>

        <Card padding="var(--space-xl)">
          <h5 style={{ marginBottom: 'var(--space-lg)', fontSize: '1rem' }}>Profile Completion</h5>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{profileCompletion}% complete</span>
              <span style={{ fontWeight: 600, color: profileCompletion >= 80 ? 'var(--success)' : 'var(--warning)' }}>
                {profileCompletion >= 80 ? 'Great!' : 'Incomplete'}
              </span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${profileCompletion}%`, height: '100%', background: profileCompletion >= 80 ? 'var(--success)' : 'var(--primary)', borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            {!user?.name && <div>⬜ Add your name</div>}
            {!user?.email && <div>⬜ Add your email</div>}
            {!user?.phone && <div>⬜ Add your phone</div>}
            {!user?.businessName && <div>⬜ Add business name for B2B</div>}
            {!user?.gstin && <div>⬜ Add GSTIN for tax benefits</div>}
          </div>
        </Card>
      </div>

      <Card padding="var(--space-xl)">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h5 style={{ fontSize: '1rem' }}>Recent Orders</h5>
          <Link to="/orders" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>View All</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>No orders yet</div>
            <div style={{ fontSize: '0.8125rem' }}>Start shopping to see your orders here</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>Order ID</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600 }}>{order.id}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{new Date(order.date).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>₹{order.total?.toLocaleString() || 0}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className={`badge badge-soft-${order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'info' : order.status === 'confirmed' ? 'primary' : order.status === 'cancelled' ? 'danger' : 'warning'}`} style={{ textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <style>{`
        @media (max-width: 768px) {
          .container > div:nth-child(2) { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .container > div:nth-child(3) { grid-template-columns: 1fr !important; }
          .container > div:nth-child(3) > div:first-child > div:first-child { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .container > div:nth-child(2) { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .container > div:nth-child(2) .card { padding: 12px !important; }
          .container > div:nth-child(2) .card svg { width: 18px !important; height: 18px !important; }
          .container > div:nth-child(2) .card div:first-child > div:first-child { width: 36px !important; height: 36px !important; }
          .container > div:nth-child(2) .card div:first-child > div:last-child div:first-child { font-size: 1.125rem !important; }
          .container > div:first-child { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .container > div:first-child h2 { font-size: 1.125rem !important; }
        }
        @media (max-width: 360px) {
          .container > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
