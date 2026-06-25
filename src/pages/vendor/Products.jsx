import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { resolveImage } from '../../api'

export default function VendorProducts() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadProducts = () => {
    setLoading(true)
    api.vendor.products({ page, limit: 20 })
      .then(res => { setProducts(res.data); setTotal(res.total) })
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProducts() }, [page])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await api.vendor.deleteProduct(id)
      showToast('Product deleted')
      loadProducts()
    } catch (err) { showToast(err.message, 'error') }
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="admin-page">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
      <div className="admin-header-bar">
        <h1>My Products ({total})</h1>
        <div className="admin-toolbar">
          <button className="admin-btn admin-btn-primary" onClick={() => navigate('/vendor/products/new')}>+ New Product</button>
        </div>
      </div>
      {loading ? <div className="admin-loading">Loading...</div> : products.length === 0 ? (
        <div className="admin-empty">No products yet. Click "+ New Product" to add your first product.</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <img src={resolveImage(p.images?.[0])} alt=""
                      style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style=\'font-size:18px\'>🧂</span>' }}
                    />
                  </td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td><span className="admin-badge admin-badge-info">{p.category}</span></td>
                  <td>₹{p.price?.toLocaleString()}</td>
                  <td><span className={`admin-badge ${p.stock > 0 ? 'admin-badge-success' : 'admin-badge-danger'}`}>{p.stock > 0 ? p.stock : 'Out of Stock'}</span></td>
                  <td><span className={`admin-badge ${p.isActive !== false ? 'admin-badge-success' : 'admin-badge-danger'}`}>{p.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => navigate(`/vendor/products/${p.id}/edit`)}>Edit</button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                    </div>
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
