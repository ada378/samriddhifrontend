import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

const CATEGORIES = ['iodized-salt', 'sea-salt', 'rock-salt', 'sendha-namak', 'black-salt', 'industrial-salt', 'organic-salt', 'flavoured-salt']

export default function AdminBulkProducts() {
  const navigate = useNavigate()
  const [items, setItems] = useState([{ name: '', price: '', stock: '', category: 'iodized-salt', vendorId: '' }])
  const [csvText, setCsvText] = useState('')
  const [mode, setMode] = useState('form')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleItemChange = (i, field, value) => {
    const updated = [...items]
    updated[i] = { ...updated[i], [field]: value }
    setItems(updated)
  }

  const addRow = () => setItems([...items, { name: '', price: '', stock: '', category: 'iodized-salt', vendorId: '' }])
  const removeRow = (i) => setItems(items.filter((_, idx) => idx !== i))

  const handleBulkSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = items.map(item => ({
        name: item.name, price: Number(item.price), stock: Number(item.stock),
        category: item.category, vendorId: item.vendorId,
      }))
      const res = await api.admin.bulkProducts(payload)
      setResult(res)
      showToast(`${res.count} products created!`)
    } catch (err) { showToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  const handleCsvSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const lines = csvText.trim().split('\n')
      if (lines.length < 2) { showToast('CSV must have header + data rows', 'error'); setSaving(false); return }
      const headers = lines[0].split(',').map(h => h.trim())
      const parsed = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim())
        const obj = {}
        headers.forEach((h, i) => { obj[h] = vals[i] || '' })
        return obj
      })
      const res = await api.admin.bulkProducts(parsed)
      setResult(res)
      showToast(`${res.count} products imported!`)
    } catch (err) { showToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  if (result) {
    return (
      <div className="admin-page">
        <div className="admin-header-bar"><h1>Upload Complete</h1></div>
        <div style={{ padding: 24, background: 'var(--bg-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#1D9E75', marginBottom: 16 }}>✅ {result.count} products created</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/products')}>View Products</button>
            <button className="admin-btn admin-btn-secondary" onClick={() => { setResult(null); setItems([{ name: '', price: '', stock: '', category: 'iodized-salt', vendorId: '' }]); setCsvText('') }}>
              Upload More
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
      <div className="admin-header-bar">
        <h1>Bulk Upload</h1>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button className={`admin-btn ${mode === 'form' ? 'admin-btn-primary' : 'admin-btn-secondary'}`} onClick={() => setMode('form')}>Form Entry</button>
        <button className={`admin-btn ${mode === 'csv' ? 'admin-btn-primary' : 'admin-btn-secondary'}`} onClick={() => setMode('csv')}>CSV Import</button>
      </div>
      {mode === 'form' ? (
        <form className="admin-form" onSubmit={handleBulkSubmit}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name *</th>
                <th>Price *</th>
                <th>Stock *</th>
                <th>Category</th>
                <th>Vendor ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{i + 1}</td>
                  <td><input value={item.name} onChange={e => handleItemChange(i, 'name', e.target.value)} style={{ width: 140, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} required /></td>
                  <td><input type="number" value={item.price} onChange={e => handleItemChange(i, 'price', e.target.value)} style={{ width: 70, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} required /></td>
                  <td><input type="number" value={item.stock} onChange={e => handleItemChange(i, 'stock', e.target.value)} style={{ width: 70, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} required /></td>
                  <td>
                    <select value={item.category} onChange={e => handleItemChange(i, 'category', e.target.value)} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td><input value={item.vendorId} onChange={e => handleItemChange(i, 'vendorId', e.target.value)} style={{ width: 70, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></td>
                  <td>{items.length > 1 && <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeRow(i)}>✕</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addRow}>+ Add Row</button>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Uploading...' : `Upload ${items.length} Products`}
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/products')}>Cancel</button>
          </div>
        </form>
      ) : (
        <form className="admin-form" onSubmit={handleCsvSubmit}>
          <div className="admin-form-group">
            <label>CSV Data</label>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>First row = headers. Columns: name, price, stock, category, vendorId</p>
            <textarea value={csvText} onChange={e => setCsvText(e.target.value)}
              style={{ width: '100%', minHeight: 200, fontFamily: 'monospace', fontSize: 13, padding: 12 }}
              placeholder={'name,price,stock,category,vendorId\nProduct 1,100,50,rock-salt\nProduct 2,200,30,sea-salt'} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Importing...' : 'Import CSV'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
