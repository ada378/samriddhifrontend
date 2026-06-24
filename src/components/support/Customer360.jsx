import { useState } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'
import Badge from '../common/Badge'
import StarRating from '../common/StarRating'
import { useApp } from '../../context/AppContext'

const MOCK_CUSTOMER = {
  id: 'CUST001',
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  email: 'rajesh.kumar@email.com',
  businessName: 'SpiceWorld Traders',
  gstin: '27AABCU1234D1Z5',
  accountStatus: 'active',
  loyaltyPoints: 1250,
  memberSince: '2025-08-15',
  totalOrders: 24,
  totalSpent: 48500,
}

const MOCK_ORDERS = [
  { id: 'ORD10001', date: '2026-05-28T10:30:00Z', total: 180, status: 'delivered', items: 1 },
  { id: 'ORD10005', date: '2026-04-15T09:00:00Z', total: 560, status: 'delivered', items: 3 },
  { id: 'ORD10008', date: '2026-03-20T14:30:00Z', total: 225, status: 'cancelled', items: 2 },
  { id: 'ORD10012', date: '2026-02-10T11:00:00Z', total: 1200, status: 'delivered', items: 5 },
]

const MOCK_TICKETS = [
  { id: 'TCK1001', subject: 'Delivery delay issue', status: 'resolved', date: '2026-05-20' },
  { id: 'TCK1003', subject: 'Wrong product received', status: 'open', date: '2026-06-01' },
]

const MOCK_REVIEWS = [
  { id: 'R001', product: 'Tata Salt Iodized', rating: 5, date: '2026-05-15' },
  { id: 'R003', product: 'Himalayan Pink Salt', rating: 4, date: '2026-04-20' },
]

export default function Customer360({ customerId }) {
  const { showToast } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedCustomer, setSearchedCustomer] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchedCustomer(MOCK_CUSTOMER)
    }
  }

  const customer = searchedCustomer

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'var(--space-xl)' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>Customer 360</h3>

      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="input-group" style={{ maxWidth: 500 }}>
          <span className="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </span>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSearch() }} placeholder="Search by Order ID, Phone, Email, or Name..." />
          <button className="input-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>

      {!customer && (
        <Card>
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <div className="empty-state-title">Search for a customer</div>
            <div className="empty-state-text">Enter an order ID, phone number, email, or customer name to pull up their 360 view.</div>
          </div>
        </Card>
      )}

      {customer && (
        <>
          <Card padding="var(--space-xl)" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2xl)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 700,
                }}>
                  {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{customer.name}</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {customer.businessName} | Customer since {new Date(customer.memberSince).getFullYear()}
                  </p>
                  <Badge variant={customer.accountStatus === 'active' ? 'success' : 'warning'} style={{ marginTop: 4 }}>
                    {customer.accountStatus}
                  </Badge>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md) var(--space-xl)', flex: 1 }}>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Phone</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0' }}>{customer.phone}</p></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Email</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0' }}>{customer.email}</p></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>GSTIN</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0', fontFamily: 'var(--font-mono)' }}>{customer.gstin}</p></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Loyalty Points</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0', fontWeight: 600, color: 'var(--accent)' }}>{customer.loyaltyPoints} pts</p></div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>{customer.totalOrders}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orders</div>
                </div>
                <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>Rs. {customer.totalSpent.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Spent</div>
                </div>
              </div>
            </div>
          </Card>

          <div className="tabs">
            {['profile', 'orders', 'tickets', 'reviews', 'loyalty'].map(tab => (
              <button key={tab} className={'tab' + (activeTab === tab ? ' active' : '')} onClick={() => setActiveTab(tab)} style={{ textTransform: 'capitalize' }}>
                {tab === 'tickets' ? 'Support Tickets' : tab}
              </button>
            ))}
          </div>

          {activeTab === 'profile' && (
            <Card>
              <h5 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Account Details</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md) var(--space-2xl)' }}>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0', fontWeight: 500 }}>{customer.name}</p></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Business Name</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0', fontWeight: 500 }}>{customer.businessName}</p></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0', fontWeight: 500 }}>{customer.phone}</p></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0', fontWeight: 500 }}>{customer.email}</p></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GSTIN</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{customer.gstin}</p></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Status</span><p style={{ margin: '2px 0 0' }}><Badge variant={customer.accountStatus === 'active' ? 'success' : 'warning'}>{customer.accountStatus}</Badge></p></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Member Since</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0', fontWeight: 500 }}>{new Date(customer.memberSince).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Orders</span><p style={{ fontSize: '0.875rem', margin: '2px 0 0', fontWeight: 500 }}>{customer.totalOrders}</p></div>
              </div>
            </Card>
          )}

          {activeTab === 'orders' && (
            <div>
              {MOCK_ORDERS.map(order => (
                <div key={order.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--bg-white)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', marginBottom: 'var(--space-sm)',
                }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{order.id}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                      {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{order.items} item{order.items > 1 ? 's' : ''}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Rs. {order.total}</span>
                    <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tickets' && (
            <div>
              {MOCK_TICKETS.map(ticket => (
                <div key={ticket.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--bg-white)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', marginBottom: 'var(--space-sm)',
                }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{ticket.subject}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {ticket.id} | {new Date(ticket.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <Badge variant={ticket.status === 'resolved' ? 'success' : ticket.status === 'open' ? 'warning' : 'info'}>
                    {ticket.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {MOCK_REVIEWS.map(review => (
                <div key={review.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--bg-white)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', marginBottom: 'var(--space-sm)',
                }}>
                  <div>
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{review.product}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                      {new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'loyalty' && (
            <Card>
              <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>
                  {customer.loyaltyPoints}
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>Loyalty Points</p>
                <div style={{ marginTop: 'var(--space-lg)' }}>
                  <div style={{ background: 'var(--bg-gray)', height: 12, borderRadius: 'var(--radius-full)', overflow: 'hidden', maxWidth: 400, margin: '0 auto' }}>
                    <div style={{ width: '42%', height: '100%', background: 'var(--accent)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    1250 / 3000 points to next tier (Gold)
                  </p>
                </div>
                <Button variant="secondary" size="sm" style={{ marginTop: 'var(--space-md)' }} onClick={() => showToast('Loyalty history loaded', 'info')}>
                  View Points History
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
