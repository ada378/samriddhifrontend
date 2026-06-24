import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'

const STATUS_TABS = ['All', 'Pending', 'Responded', 'Accepted', 'Declined']

const initialQuotes = [
  { id: 'QT001', product: 'Himalayan Pink Salt Fine - 1kg', vendor: 'Himalayan Pink Exports', quantity: 50, status: 'responded', date: '2026-06-01', response: { price: 42, delivery: '7-10 days', notes: 'Bulk discount available for orders above 100 units' } },
  { id: 'QT002', product: 'Gujarat Sea Salt Fine - 1kg', vendor: 'Gujarat Sea Salt Co', quantity: 100, status: 'pending', date: '2026-06-05', response: null },
  { id: 'QT003', product: 'Tata Salt Iodized - 1kg', vendor: 'Tata Salt Premium', quantity: 200, status: 'accepted', date: '2026-05-20', response: { price: 16, delivery: '3-5 days', notes: 'Special pricing for bulk order' } },
  { id: 'QT004', product: 'Organic Sea Salt Fine - 1kg', vendor: 'Organic Salt Farms', quantity: 25, status: 'declined', date: '2026-05-15', response: { price: 62, delivery: '5-7 days', notes: 'Cannot meet requested price at this quantity' } },
]

export default function QuoteRequests() {
  const { addToCart, showToast } = useApp()
  const [activeTab, setActiveTab] = useState('All')
  const [quotes, setQuotes] = useState(initialQuotes)
  const [expandedId, setExpandedId] = useState(null)

  const filtered = useMemo(() => {
    if (activeTab === 'All') return quotes
    return quotes.filter(q => q.status === activeTab.toLowerCase())
  }, [quotes, activeTab])

  const handleCancel = (id) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: 'declined' } : q))
    showToast('Quote request cancelled', 'info')
  }

  const handleAccept = (quote) => {
    showToast(`Quote ${quote.id} accepted! Add to cart to order.`, 'success')
    setQuotes(prev => prev.map(q => q.id === quote.id ? { ...q, status: 'accepted' } : q))
  }

  const statusBadge = (status) => {
    const map = { pending: 'warning', responded: 'info', accepted: 'success', declined: 'danger' }
    return <span className={`badge badge-soft-${map[status] || 'primary'}`} style={{ textTransform: 'capitalize' }}>{status}</span>
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)' }}>
      <h3 style={{ marginBottom: 'var(--space-xl)' }}>Quote Requests</h3>

      <div className="tabs">
        {STATUS_TABS.map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
          </div>
          <div className="empty-state-title">No quote requests</div>
          <div className="empty-state-text">Request bulk quotes from your favorite vendors.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(quote => (
            <div key={quote.id} style={{
              border: `1px solid ${expandedId === quote.id ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', overflow: 'hidden',
              background: 'var(--bg-white)',
            }}>
              <div onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-gray)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: 2 }}>{quote.product}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {quote.vendor} · Qty: {quote.quantity} · {new Date(quote.date).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {statusBadge(quote.status)}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ transform: expandedId === quote.id ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {expandedId === quote.id && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ paddingTop: 12 }}>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 8 }}>Quote #{quote.id}</div>
                    {quote.response ? (
                      <div style={{ background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 8 }}>Vendor Response</div>
                        <div style={{ fontSize: '0.875rem', lineHeight: 1.8 }}>
                          <div><strong>Offered Price:</strong> ₹{quote.response.price}/unit</div>
                          <div><strong>Delivery:</strong> {quote.response.delivery}</div>
                          <div><strong>Notes:</strong> {quote.response.notes}</div>
                        </div>
                        {quote.status === 'responded' && (
                          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <Button size="sm" onClick={() => handleAccept(quote)}>Accept Quote</Button>
                            <Button size="sm" variant="ghost" onClick={() => handleCancel(quote.id)}>Decline</Button>
                          </div>
                        )}
                        {quote.status === 'accepted' && (
                          <div style={{ marginTop: 12 }}>
                            <Button size="sm" icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>}>Convert to Order</Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Awaiting vendor response...
                        <div style={{ marginTop: 12 }}>
                          <Button size="sm" variant="ghost" onClick={() => handleCancel(quote.id)}>Cancel Request</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
