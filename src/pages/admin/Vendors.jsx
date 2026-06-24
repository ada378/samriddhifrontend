import { useState, useEffect } from 'react'
import api from '../../api'

export default function AdminVendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    api.admin.vendors()
      .then(res => setVendors(res.data || []))
      .catch(err => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const startEdit = (v) => {
    setEditingId(v.id)
    setEditForm({ name: v.name, state: v.state, city: v.city, isVerified: v.isVerified, tier: v.tier, phone: v.phone || '', email: v.email || '', description: v.description || '', productionCapacity: v.productionCapacity || '', minOrder: v.minOrder || '', deliveryTime: v.deliveryTime || '' })
  }

  const saveEdit = async (id) => {
    try {
      await api.admin.updateVendor(id, editForm)
      setVendors(vendors.map(v => v.id === id ? { ...v, ...editForm } : v))
      setEditingId(null)
      showToast('Vendor updated')
    } catch (err) { showToast(err.message, 'error') }
  }

  return (
    <div className="admin-page">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
      <div className="admin-header-bar">
        <h1>Vendors ({vendors.length})</h1>
      </div>
      {loading ? <div className="admin-loading">Loading...</div> : vendors.length === 0 ? (
        <div className="admin-empty">No vendors found</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}></th>
              <th>ID</th>
              <th>Vendor</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Rating</th>
              <th>Tier</th>
              <th>Verified</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(v => (
              <>
                <tr key={v.id}>
                  <td onClick={() => toggleExpand(v.id)} style={{ cursor: 'pointer' }}>{expandedId === v.id ? '▼' : '▶'}</td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{v.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {v.logo?.startsWith('http') ? <img src={v.logo} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : (
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                          {(v.logo || v.name?.charAt(0) || '?').toUpperCase()}
                        </div>
                      )}
                      <span style={{ fontWeight: 600 }}>{editingId === v.id ? (
                        <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} />
                      ) : v.name}</span>
                    </div>
                  </td>
                  <td>
                    {editingId === v.id ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <input value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} style={{ width: 80, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} />
                        <input value={editForm.state} onChange={e => setEditForm({ ...editForm, state: e.target.value })} style={{ width: 80, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} />
                      </div>
                    ) : `${v.city || '-'}, ${v.state || '-'}`}
                  </td>
                  <td style={{ fontSize: 13 }}>{v.email || v.contactEmail || '-'}<br />{v.phone || v.contactPhone || '-'}</td>
                  <td>⭐ {v.rating || '-'}</td>
                  <td>
                    {editingId === v.id ? (
                      <select value={editForm.tier} onChange={e => setEditForm({ ...editForm, tier: e.target.value })}
                        style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}>
                        <option value="gold">Gold</option><option value="silver">Silver</option><option value="bronze">Bronze</option>
                      </select>
                    ) : (
                      <span className={`admin-badge ${v.tier === 'gold' ? 'admin-badge-warning' : v.tier === 'silver' ? 'admin-badge-info' : 'admin-badge-success'}`}>
                        {v.tier || 'bronze'}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === v.id ? (
                      <input type="checkbox" checked={editForm.isVerified} onChange={e => setEditForm({ ...editForm, isVerified: e.target.checked })} />
                    ) : v.isVerified ? '✅' : '❌'}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{v.productCount || '-'}</td>
                  <td>
                    {editingId === v.id ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => saveEdit(v.id)}>Save</button>
                        <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => startEdit(v)}>Edit</button>
                    )}
                  </td>
                </tr>
                {expandedId === v.id && (
                  <tr key={`${v.id}-detail`}>
                    <td colSpan={10} style={{ padding: 0, background: '#f8f9ff' }}>
                      <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
                          <div>
                            <h4 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Business Info</h4>
                            <div style={{ fontSize: 14, lineHeight: 2 }}>
                              <div><strong>Name:</strong> {v.name}</div>
                              <div><strong>Slug:</strong> {v.slug || '-'}</div>
                              <div><strong>Description:</strong> {v.description || '-'}</div>
                              <div><strong>Established:</strong> {v.established || '-'}</div>
                              <div><strong>Production Capacity:</strong> {v.productionCapacity || '-'}</div>
                              <div><strong>MOQ:</strong> {v.minOrder || '-'}</div>
                              <div><strong>Delivery Time:</strong> {v.deliveryTime || '-'}</div>
                            </div>
                          </div>
                          <div>
                            <h4 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Contact & Location</h4>
                            <div style={{ fontSize: 14, lineHeight: 2 }}>
                              <div><strong>Email:</strong> {v.email || v.contactEmail || '-'}</div>
                              <div><strong>Phone:</strong> {v.phone || v.contactPhone || '-'}</div>
                              <div><strong>City:</strong> {v.city || '-'}</div>
                              <div><strong>State:</strong> {v.state || '-'}</div>
                              <div><strong>Address:</strong> {v.address || '-'}</div>
                            </div>
                          </div>
                          <div>
                            <h4 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Ratings & Verification</h4>
                            <div style={{ fontSize: 14, lineHeight: 2 }}>
                              <div><strong>Rating:</strong> ⭐ {v.rating || '-'} ({v.reviewCount || 0} reviews)</div>
                              <div><strong>Tier:</strong> {v.tier || 'bronze'}</div>
                              <div><strong>Verified:</strong> {v.isVerified ? '✅ Yes' : '❌ No'}</div>
                              <div><strong>Products Count:</strong> {v.productCount || 0}</div>
                            </div>
                          </div>
                        </div>

                        {v.certifications && v.certifications.length > 0 && (
                          <div style={{ marginBottom: 16 }}>
                            <h4 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Certifications</h4>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {v.certifications.map((cert, i) => (
                                <span key={i} className="admin-badge admin-badge-success">{cert}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {v.topProducts && v.topProducts.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Top Products</h4>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {v.topProducts.map((p, i) => (
                                <span key={i} style={{ padding: '4px 12px', background: '#e8effd', borderRadius: 4, fontSize: 13, color: '#1a56db' }}>{p}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
