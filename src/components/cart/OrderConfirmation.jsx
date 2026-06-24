import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'

export default function OrderConfirmation() {
  const { orders, showToast } = useApp()
  const [copied, setCopied] = useState(false)

  const latestOrder = useMemo(() => {
    return orders.length > 0 ? orders[0] : null
  }, [orders])

  const estimatedDelivery = useMemo(() => {
    if (!latestOrder) return ''
    const date = new Date()
    date.setDate(date.getDate() + 5)
    return date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }, [latestOrder])

  const handleCopyOrderId = () => {
    if (latestOrder) {
      navigator.clipboard.writeText(latestOrder.id)
      setCopied(true)
      showToast('Order ID copied!', 'success')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!latestOrder) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <div className="empty-state-title">No order found</div>
          <div className="empty-state-text">Looks like you haven't placed any orders yet.</div>
          <Link to="/">
            <Button icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>}>Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 640 }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: 'var(--success-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="16 8 10 16 7 13" />
          </svg>
        </div>
        <h2 style={{ color: 'var(--success)', marginBottom: 8 }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Thank you for your order. We'll send you a confirmation shortly.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Order ID</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: '1.125rem', fontFamily: 'var(--font-mono)' }}>{latestOrder.id}</span>
              <button onClick={handleCopyOrderId} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)',
                transition: 'all 0.15s', display: 'flex',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-gray)'; e.currentTarget.style.color = 'var(--primary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              </button>
            </div>
          </div>
          <span className={`badge badge-soft-${latestOrder.status === 'confirmed' ? 'primary' : 'success'}`} style={{ textTransform: 'capitalize' }}>{latestOrder.status}</span>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 8 }}>Order Summary</div>
          {latestOrder.items?.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.productName || item.product?.name} × {item.quantity}</span>
              <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', fontWeight: 700, marginBottom: 8 }}>
          <span>Total Paid</span>
          <span style={{ color: 'var(--primary)' }}>₹{latestOrder.total?.toLocaleString() || 0}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span>Payment</span>
          <span>{latestOrder.paymentMethod}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--info-light)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xl)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--info)' }}>Estimated Delivery:</strong> {estimatedDelivery}
        </div>
      </div>

      <div style={{ padding: '14px 16px', background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xl)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          <span>Order confirmation sent to your email & SMS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
          <a href="#" style={{ color: 'var(--text-link)', textDecoration: 'underline' }}>Download GST Invoice</a>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to={`/orders`}>
          <Button variant="secondary" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
          }>Track Order</Button>
        </Link>
        <Link to="/">
          <Button icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          }>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
