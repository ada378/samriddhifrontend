import { useState, useEffect } from 'react'
import api from '../../api'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [customerOrders, setCustomerOrders] = useState({})

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    api.admin.customers()
      .then(res => setCustomers(res.data || []))
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const toggleExpand = async (id) => {
    if (expandedId === id) { setExpandedId(null); return }
    setExpandedId(id)
    if (!customerOrders[id]) {
      try {
        const res = await api.admin.customerOrders(id)
        setCustomerOrders(prev => ({ ...prev, [id]: res.data || [] }))
      } catch { }
    }
  }

  return (
    <div className="admin-page">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
      <div className="admin-header-bar">
        <h1>Customers ({customers.length})</h1>
      </div>
      {loading ? <div className="admin-loading">Loading...</div> : customers.length === 0 ? (
        <div className="admin-empty">No customers found</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}></th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Orders</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td colSpan={9} style={{ padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr onClick={() => toggleExpand(c.id)} style={{ cursor: 'pointer', background: expandedId === c.id ? '#f8f9ff' : undefined }}>
                        <td style={{ width: 30 }}>{expandedId === c.id ? '▼' : '▶'}</td>
                        <td style={{ fontSize: 12, color: '#6b7280' }}>{c.id}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                              {c.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span style={{ fontWeight: 600 }}>{c.name}</span>
                          </div>
                        </td>
                        <td>{c.email}</td>
                        <td>{c.phone || '-'}</td>
                        <td style={{ fontSize: 13, color: '#6b7280' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</td>
                        <td>
                          <span className={`admin-badge ${c.isActive !== false ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                            {c.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{c.orderCount || 0}</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{(c.totalSpent || 0).toLocaleString()}</td>
                      </tr>
                      {expandedId === c.id && (
                        <tr>
                          <td colSpan={9} style={{ padding: 0, background: '#f8f9ff' }}>
                            <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
                                <div>
                                  <h4 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Personal Info</h4>
                                  <div style={{ fontSize: 14, lineHeight: 2 }}>
                                    <div><strong>Name:</strong> {c.name}</div>
                                    <div><strong>Email:</strong> {c.email}</div>
                                    <div><strong>Phone:</strong> {c.phone || '-'}</div>
                                    <div><strong>Role:</strong> {c.role || 'buyer'}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Address</h4>
                                  <div style={{ fontSize: 14, lineHeight: 2 }}>
                                    <div><strong>Address:</strong> {c.address?.line1 || '-'}{c.address?.line2 ? `, ${c.address.line2}` : ''}</div>
                                    <div><strong>City:</strong> {c.address?.city || '-'}</div>
                                    <div><strong>State:</strong> {c.address?.state || '-'}</div>
                                    <div><strong>Pincode:</strong> {c.address?.pincode || '-'}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Account</h4>
                                  <div style={{ fontSize: 14, lineHeight: 2 }}>
                                    <div><strong>Joined:</strong> {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</div>
                                    <div><strong>Status:</strong> {c.isActive !== false ? 'Active' : 'Inactive'}</div>
                                    <div><strong>Orders:</strong> {c.orderCount || 0}</div>
                                    <div><strong>Total Spent:</strong> ₹{(c.totalSpent || 0).toLocaleString()}</div>
                                  </div>
                                </div>
                              </div>
                              {customerOrders[c.id] && customerOrders[c.id].length > 0 && (
                                <div>
                                  <h4 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Order History</h4>
                                  <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr style={{ background: '#f1f5f9' }}>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Order ID</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Total</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Payment</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {customerOrders[c.id].map(order => (
                                        <tr key={order.id}>
                                          <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontFamily: 'monospace', fontSize: 12 }}>{order.id}</td>
                                          <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                                          <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: 600 }}>₹{(order.total || 0).toLocaleString()}</td>
                                          <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                                            <span className={`admin-badge admin-badge-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : order.status === 'shipped' ? 'info' : 'warning'}`}>
                                              {order.status}
                                            </span>
                                          </td>
                                          <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                                            <span className={`admin-badge ${order.paymentStatus === 'paid' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                                              {order.paymentStatus}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
