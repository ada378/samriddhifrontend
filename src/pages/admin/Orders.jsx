import { useState, useEffect } from 'react'
import api from '../../api'

const STATUS_LIST = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const statusColors = {
  confirmed: 'admin-badge-info',
  processing: 'admin-badge-warning',
  shipped: 'admin-badge-info',
  delivered: 'admin-badge-success',
  cancelled: 'admin-badge-danger',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadOrders = () => {
    setLoading(true)
    const params = { page, limit: 20 }
    if (statusFilter) params.status = statusFilter
    api.admin.orders(params)
      .then(res => { setOrders(res.data); setTotal(res.total) })
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, [page, statusFilter])

  const handleStatusChange = async (id, status) => {
    try {
      await api.admin.updateOrderStatus(id, status)
      showToast(`Order ${id} → ${status}`)
      loadOrders()
    } catch (err) { showToast(err.message, 'error') }
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="admin-page">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
      <div className="admin-header-bar">
        <h1>Orders ({total})</h1>
        <div className="admin-toolbar">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}>
            <option value="">All</option>
            {STATUS_LIST.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>
      {loading ? <div className="admin-loading">Loading...</div> : orders.length === 0 ? (
        <div className="admin-empty">No orders found</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Vendor</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>{o.id}</td>
                  <td>{o.buyerName || '-'}</td>
                  <td>{o.vendorName || o.vendorId || '-'}</td>
                  <td style={{ textAlign: 'center' }}>{o.items?.length || 0}</td>
                  <td style={{ fontWeight: 600 }}>₹{(o.total || 0).toLocaleString()}</td>
                  <td style={{ fontSize: 12 }}>{o.date ? new Date(o.date).toLocaleDateString('en-IN') : '-'}</td>
                  <td>
                    <span className={`admin-badge ${o.paymentStatus === 'paid' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                      {o.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td><span className={`admin-badge ${statusColors[o.status] || 'admin-badge-info'}`}>{o.status}</span></td>
                  <td>
                    <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                      style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12 }}>
                      {STATUS_LIST.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`admin-btn admin-btn-sm ${page === i + 1 ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                  onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
