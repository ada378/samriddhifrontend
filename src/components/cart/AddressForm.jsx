import { useState } from 'react'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

const initialForm = { name: '', phone: '', line1: '', line2: '', city: '', district: '', state: '', pincode: '', gst: '', isDefault: false }

export default function AddressForm({ savedAddresses = [], onSelect, onSave, selectedId, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone'
    if (!form.line1.trim()) e.line1 = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.district.trim()) e.district = 'District is required'
    if (!form.state) e.state = 'Select state'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode'
    if (form.gst && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[A-Z0-9]{1}$/.test(form.gst.toUpperCase())) e.gst = 'Invalid GST format'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const address = { id: editingId || `addr_${Date.now()}`, ...form, gst: form.gst.toUpperCase() }
    if (onSave) onSave(address)
    setForm(initialForm)
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const handleEdit = (addr) => {
    setForm({ name: addr.name, phone: addr.phone, line1: addr.line1, line2: addr.line2 || '', city: addr.city, district: addr.district, state: addr.state, pincode: addr.pincode, gst: addr.gst || '', isDefault: addr.isDefault || false })
    setEditingId(addr.id)
    setShowForm(true)
  }

  const fieldStyle = {
    width: '100%', padding: '10px 14px', border: '2px solid var(--border)',
    borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.875rem',
    transition: 'border-color 0.15s',
  }

  const labelStyle = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <h4 style={{ fontSize: '1rem' }}>Select Delivery Address</h4>
        {!showForm && (
          <Button size="sm" variant="secondary" onClick={() => { setForm(initialForm); setEditingId(null); setShowForm(true) }} icon={
<Icon name="plus" size={14} />
          }>Add New Address</Button>
        )}
      </div>

      {!showForm && savedAddresses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {savedAddresses.map(addr => (
            <label key={addr.id} style={{
              display: 'flex', gap: 12, padding: '14px 16px',
              border: `2px solid ${selectedId === addr.id ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              background: selectedId === addr.id ? 'var(--primary-light)' : 'var(--bg-white)',
              transition: 'all 0.15s',
            }}>
              <input type="radio" name="address" checked={selectedId === addr.id} onChange={() => onSelect && onSelect(addr.id)} style={{ marginTop: 2 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{addr.name}</span>
                  {addr.isDefault && <span className="badge badge-soft-primary">Default</span>}
                  <span className="badge badge-soft-info">{addr.tags?.[0] || 'Home'}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.district}, {addr.state} - {addr.pincode}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>Phone: {addr.phone}</div>
                {addr.gst && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GST: {addr.gst}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={(e) => { e.preventDefault(); handleEdit(addr) }} style={{ fontSize: '0.8125rem', color: 'var(--text-link)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit</button>
                  <button onClick={(e) => { e.preventDefault(); onDelete && onDelete(addr.id) }} style={{ fontSize: '0.8125rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Delete</button>
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      {!showForm && savedAddresses.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>
<Icon name="home" size={40} />
          </div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No saved addresses</div>
          <div style={{ fontSize: '0.8125rem' }}>Add a delivery address to continue</div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="address-form" style={{ background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-xl)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Full Name *</label>
              <input style={fieldStyle} placeholder="Enter full name" value={form.name} onChange={e => handleChange('name', e.target.value)} />
              {errors.name && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.name}</span>}
            </div>
            <div>
              <label style={labelStyle}>Phone *</label>
              <div style={{ display: 'flex' }}>
                <span style={{ ...fieldStyle, width: 'auto', borderRight: 'none', background: 'var(--bg-gray)', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', paddingRight: 8 }}>+91</span>
                <input style={{ ...fieldStyle, borderLeft: 'none', flex: 1 }} placeholder="10-digit number" value={form.phone} onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 10); handleChange('phone', v) }} />
              </div>
              {errors.phone && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.phone}</span>}
            </div>
            <div>
              <label style={labelStyle}>Pincode *</label>
              <input style={fieldStyle} placeholder="6-digit pincode" value={form.pincode} onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); handleChange('pincode', v) }} />
              {errors.pincode && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.pincode}</span>}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Address Line 1 *</label>
              <input style={fieldStyle} placeholder="House/Flat no., Building, Street" value={form.line1} onChange={e => handleChange('line1', e.target.value)} />
              {errors.line1 && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.line1}</span>}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Address Line 2</label>
              <input style={fieldStyle} placeholder="Landmark, Area (optional)" value={form.line2} onChange={e => handleChange('line2', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>City *</label>
              <input style={fieldStyle} placeholder="City" value={form.city} onChange={e => handleChange('city', e.target.value)} />
              {errors.city && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.city}</span>}
            </div>
            <div>
              <label style={labelStyle}>District *</label>
              <input style={fieldStyle} placeholder="District" value={form.district} onChange={e => handleChange('district', e.target.value)} />
              {errors.district && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.district}</span>}
            </div>
            <div>
              <label style={labelStyle}>State *</label>
              <select style={fieldStyle} value={form.state} onChange={e => handleChange('state', e.target.value)}>
                <option value="">Select State</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.state}</span>}
            </div>
            <div>
              <label style={labelStyle}>GST Number <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional for B2B)</span></label>
              <input style={fieldStyle} placeholder="15-digit GSTIN" value={form.gst} onChange={e => handleChange('gst', e.target.value.toUpperCase())} />
              {errors.gst && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.gst}</span>}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: '0.875rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isDefault} onChange={e => handleChange('isDefault', e.target.checked)} />
            Set as default address
          </label>

          <div style={{ display: 'flex', gap: 12, marginTop: 'var(--space-xl)' }}>
            <Button type="submit">{editingId ? 'Update Address' : 'Save Address'}</Button>
            <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setForm(initialForm); setEditingId(null); setErrors({}) }}>Cancel</Button>
          </div>
        </form>
      )}

      <style>{`
        @media (max-width: 768px) {
          .address-form > div:first-child { grid-template-columns: 1fr !important; }
          .address-form > div:first-child > div { grid-column: span 1 !important; }
        }
      `}</style>
    </div>
  )
}
