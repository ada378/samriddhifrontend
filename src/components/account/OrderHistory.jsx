import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'

const STATUS_TABS = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default function OrderHistory() {
  const { orders, addToCart, showToast } = useApp()
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = orders
    if (activeTab !== 'All') result = result.filter(o => o.status.toLowerCase() === activeTab.toLowerCase())
    if (search.trim()) result = result.filter(o => o.id.toLowerCase().includes(search.toLowerCase()))
    return result.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [orders, activeTab, search])

  const handleReorder = (order) => {
    order.items?.forEach(item => {
      addToCart({ id: item.productId, name: item.productName, price: item.price }, order.vendorId, item.quantity)
    })
    showToast('Items added to cart!', 'success')
  }

  const statusBadge = (status) => {
    const map = { delivered: 'success', shipped: 'info', confirmed: 'primary', pending: 'warning', cancelled: 'danger' }
    return <span className={`badge badge-soft-${map[status] || 'primary'}`} style={{ textTransform: 'capitalize' }}>{status}</span>
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)' }}>
      <h3 style={{ marginBottom: 'var(--space-xl)' }}>Order History</h3>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 12 }}>
        <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none', gap: 4 }}>
          {STATUS_TABS.map(tab => (
            <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>
        <div style={{ position: 'relative', minWidth: 220 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" placeholder="Search by Order ID" value={search} onChange={e => setSearch(e.target.value)} style={{
            width: '100%', padding: '8px 12px 8px 36px', border: '2px solid var(--border)',
            borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.875rem',
          }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
          </div>
          <div className="empty-state-title">No orders found</div>
          <div className="empty-state-text">{search ? 'Try a different order ID' : `No ${activeTab.toLowerCase()} orders yet`}</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>Vendor</th>
                <th style={{ textAlign: 'left', padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>Total</th>
                <th style={{ textAlign: 'left', padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600 }}>{order.id}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td style={{ padding: '12px 14px' }}>{order.vendorName}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>₹{order.total?.toLocaleString() || 0}</td>
                  <td style={{ padding: '12px 14px' }}>{statusBadge(order.status)}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      {order.status !== 'cancelled' && (
                        <Button size="sm" variant="secondary" onClick={() => handleReorder(order)}>Reorder</Button>
                      )}
                      <button style={{ fontSize: '0.8125rem', color: 'var(--text-link)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 4 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .tabs { overflow-x: auto; flex-wrap: nowrap; width: 100%; }
          table { font-size: 0.8125rem !important; }
          td, th { padding: 8px 10px !important; }
        }
      `}</style>
    </div>
  )
}
