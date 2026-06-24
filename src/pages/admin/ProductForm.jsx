import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'

const CATEGORIES = ['iodized-salt', 'sea-salt', 'rock-salt', 'sendha-namak', 'black-salt', 'industrial-salt', 'organic-salt', 'flavoured-salt']
const PACKAGING = ['Pouch', 'Bag', 'Jar', 'Box', 'Drum', 'Crate']
const GRADES = ['Standard', 'Premium', 'Fine', 'Coarse', 'Extra Fine', 'Industrial']

const emptyProduct = {
  name: '', vendorId: '', category: 'iodized-salt', price: '', stock: '',
  moq: '1', packaging: 'Pouch', grade: 'Standard', description: '', images: '',
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(emptyProduct)
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const imageList = () => form.images.split('\n').filter(Boolean)
  const imageUrl = (url) => url.startsWith('http') ? url : `http://localhost:5000${url}`

  useEffect(() => {
    api.admin.vendors()
      .then(res => setVendors(res.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      api.admin.product(id)
        .then(res => {
          const p = res.data
          setForm({
            name: p.name || '', vendorId: p.vendorId || '',
            category: p.category || 'iodized-salt', price: p.price || '',
            stock: p.stock || '', moq: p.moq || '1',
            packaging: p.packaging || 'Pouch', grade: p.grade || 'Standard',
            description: p.description || '', images: p.images?.join('\n') || '',
          })
        })
        .catch(err => showToast(err.message, 'error'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      if (files.length === 1) {
        const res = await api.upload.single(files[0])
        const current = imageList()
        current.push(res.data.url)
        setForm({ ...form, images: current.join('\n') })
      } else {
        const res = await api.upload.multiple(files)
        const current = imageList()
        current.push(...res.data)
        setForm({ ...form, images: current.join('\n') })
      }
      showToast(`${files.length} image(s) uploaded!`)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (idx) => {
    const current = imageList()
    current.splice(idx, 1)
    setForm({ ...form, images: current.join('\n') })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name, vendorId: form.vendorId, category: form.category,
        price: Number(form.price), stock: Number(form.stock),
        moq: Number(form.moq), packaging: form.packaging, grade: form.grade,
        description: form.description,
        images: imageList(),
      }
      if (isEdit) {
        await api.admin.updateProduct(id, payload)
        showToast('Product updated!')
      } else {
        await api.admin.createProduct(payload)
        showToast('Product created!')
        setForm(emptyProduct)
      }
      setTimeout(() => navigate('/admin/products'), 1000)
    } catch (err) { showToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Loading...</div>

  return (
    <div className="admin-page">
      {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>}
      <div className="admin-header-bar">
        <h1>{isEdit ? 'Edit Product' : 'New Product'}</h1>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-row">
          <div className="admin-form-group" style={{ flex: 2 }}>
            <label>Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Enter product name" required />
          </div>
          <div className="admin-form-group" style={{ flex: 1 }}>
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
            </select>
          </div>
        </div>
        <div className="admin-form-group">
          <label>Vendor *</label>
          <select name="vendorId" value={form.vendorId} onChange={handleChange} required>
            <option value="">Select vendor</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
          </select>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Price (₹) *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0" required />
          </div>
          <div className="admin-form-group">
            <label>Stock *</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" required />
          </div>
          <div className="admin-form-group">
            <label>MOQ</label>
            <input name="moq" type="number" value={form.moq} onChange={handleChange} />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Packaging</label>
            <select name="packaging" value={form.packaging} onChange={handleChange}>
              {PACKAGING.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="admin-form-group">
            <label>Grade</label>
            <select name="grade" value={form.grade} onChange={handleChange}>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div className="admin-form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the product..." rows={4} />
        </div>
        <div className="admin-form-group">
          <label>Product Images</label>
          {imageList().length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {imageList().map((url, i) => (
                <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                  <img src={imageUrl(url)} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }}
                    onError={(e) => { e.target.style.display = 'none' }} />
                  <button type="button" onClick={() => removeImage(i)}
                    style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', border: 'none', background: '#ef4444', color: '#fff', fontSize: 12, lineHeight: '20px', textAlign: 'center', cursor: 'pointer', padding: 0 }}>×</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
            <span style={{ fontSize: 12, color: '#6b7280' }}>or enter URLs below</span>
          </div>
        </div>
        <div className="admin-form-group">
          <label>Image URLs (one per line)</label>
          <textarea name="images" value={form.images} onChange={handleChange} placeholder="https://example.com/image.jpg" rows={3} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/products')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
