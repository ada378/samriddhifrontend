import { useState, useEffect } from 'react'
import api from '../../api'

const STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const statusColors = {
  confirmed: 'admin-badge-info',
  processing: 'admin-badge-warning',
  shipped: 'admin-badge-info',
  delivered: 'admin-badge-success',
  cancelled: 'admin-badge-danger',
}

export default function VendorOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadOrders = () => {
    setLoading(true)
    api.vendor.orders({})
      .then(res => setOrders(res.data || []))
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await api.vendor.updateOrderStatus(id, status)
      showToast(`Order ${id} updated to ${status}`)
      loadOrders()
    } catch (err) { showToast(err.message, 'error') }
  }

  return (
    <div className="admin-page">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
      <div className="admin-header-bar">
        <h1>Orders ({orders.length})</h1>
      </div>
      {loading ? <div className="admin-loading">Loading...</div> : orders.length === 0 ? (
        <div className="admin-empty">No orders received yet.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>{o.id}</td>
                <td style={{ fontWeight: 500 }}>{o.buyerName || o.buyer?.name || '-'}</td>
                <td>{o.items?.length || 0}</td>
                <td style={{ fontWeight: 600 }}>₹{(o.total || 0).toLocaleString()}</td>
                <td style={{ fontSize: 12 }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '-'}</td>
                <td>
                  <span className={`admin-badge ${o.paymentStatus === 'paid' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                    {o.paymentStatus || 'pending'}
                  </span>
                </td>
                <td><span className={`admin-badge ${statusColors[o.status] || 'admin-badge-info'}`}>{o.status}</span></td>
                <td>
                  <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                    style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12 }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
