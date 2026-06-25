import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { resolveImage } from '../../api'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadProducts = () => {
    setLoading(true)
    api.admin.products({ page, limit: 20, search })
      .then(res => { setProducts(res.data); setTotal(res.total) })
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProducts() }, [page, search])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await api.admin.deleteProduct(id)
      showToast('Product deleted')
      loadProducts()
    } catch (err) { showToast(err.message, 'error') }
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="admin-page">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
      <div className="admin-header-bar">
        <h1>Products ({total})</h1>
        <div className="admin-toolbar">
          <input className="admin-search-input" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          <Link to="/admin/products/new" className="admin-btn admin-btn-primary">+ New</Link>
          <Link to="/admin/products/bulk" className="admin-btn admin-btn-secondary">Bulk Upload</Link>
        </div>
      </div>
      {loading ? <div className="admin-loading">Loading...</div> : products.length === 0 ? (
        <div className="admin-empty">No products found</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
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
                  <td>{p.vendorId}</td>
                  <td><span className="admin-badge admin-badge-info">{p.category}</span></td>
                  <td>₹{p.price?.toLocaleString()}</td>
                  <td><span className={`admin-badge ${p.stock > 0 ? 'admin-badge-success' : 'admin-badge-danger'}`}>{p.stock > 0 ? p.stock : 'Out'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => navigate(`/admin/products/${p.id}/edit`)}>Edit</button>
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
