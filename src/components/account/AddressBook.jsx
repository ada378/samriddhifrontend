import { useState } from 'react'
import Button from '../common/Button'
import Modal from '../common/Modal'

const TAG_OPTIONS = ['Home', 'Office', 'Warehouse', 'Other']

const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']

export default function AddressBook() {
  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Rajesh Kumar', phone: '9876543210', line1: '42, MG Road', line2: 'Bandra West', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', pincode: '400050', tag: 'Home', isDefault: true },
    { id: 2, name: 'Rajesh Kumar', phone: '9876543210', line1: '15, Sector 12', line2: 'Dwarka', city: 'New Delhi', district: 'South West Delhi', state: 'Delhi', pincode: '110078', tag: 'Office', isDefault: false },
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', line1: '', line2: '', city: '', district: '', state: '', pincode: '', tag: 'Home', isDefault: false })
  const [errors, setErrors] = useState({})

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', phone: '', line1: '', line2: '', city: '', district: '', state: '', pincode: '', tag: 'Home', isDefault: false })
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (addr) => {
    setEditing(addr.id)
    setForm({ name: addr.name, phone: addr.phone, line1: addr.line1, line2: addr.line2 || '', city: addr.city, district: addr.district, state: addr.state, pincode: addr.pincode, tag: addr.tag || 'Home', isDefault: addr.isDefault })
    setErrors({})
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit phone'
    if (!form.line1.trim()) e.line1 = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.district.trim()) e.district = 'Required'
    if (!form.state) e.state = 'Select state'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    if (editing) {
      setAddresses(prev => prev.map(a => a.id === editing ? { ...a, ...form, id: a.id } : a))
    } else {
      const newAddr = { ...form, id: Date.now() }
      if (form.isDefault) setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })))
      setAddresses(prev => [...prev, newAddr])
    }
    setModalOpen(false)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '2px solid var(--border)',
    borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.875rem',
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Saved Addresses</h3>
        <Button size="sm" onClick={openAdd} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}>Add New</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {addresses.map(addr => (
          <div key={addr.id} style={{
            display: 'flex', gap: 16, padding: 'var(--space-lg)',
            border: `2px solid ${addr.isDefault ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)', background: addr.isDefault ? 'var(--primary-light)' : 'var(--bg-white)',
            position: 'relative',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{addr.name}</span>
                <span className={`badge badge-soft-${addr.tag === 'Home' ? 'primary' : addr.tag === 'Office' ? 'info' : 'warning'}`}>{addr.tag}</span>
                {addr.isDefault && <span className="badge badge-soft-success">Default</span>}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                {addr.city}, {addr.district}, {addr.state} - {addr.pincode}<br />
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Phone: {addr.phone}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={() => openEdit(addr)} style={{ fontSize: '0.8125rem', color: 'var(--text-link)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Edit</button>
                <button onClick={() => handleDelete(addr.id)} style={{ fontSize: '0.8125rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Delete</button>
                {!addr.isDefault && <button onClick={() => handleSetDefault(addr.id)} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Set as Default</button>}
              </div>
            </div>
          </div>
        ))}
        {addresses.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-5xl) 0', color: 'var(--text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 12 }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No saved addresses</div>
            <div style={{ fontSize: '0.875rem' }}>Add your first delivery address</div>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Address' : 'Add New Address'} footer={
        <div style={{ display: 'flex', gap: 12 }}>
          <Button onClick={handleSave}>{editing ? 'Update' : 'Save Address'}</Button>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
        </div>
      }>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' }}>Full Name</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            {errors.name && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>{errors.name}</span>}
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' }}>Phone</label>
            <input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} />
            {errors.phone && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>{errors.phone}</span>}
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' }}>Pincode</label>
            <input style={inputStyle} value={form.pincode} onChange={e => setForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))} />
            {errors.pincode && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>{errors.pincode}</span>}
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' }}>Address Line 1</label>
            <input style={inputStyle} value={form.line1} onChange={e => setForm(p => ({ ...p, line1: e.target.value }))} />
            {errors.line1 && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>{errors.line1}</span>}
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' }}>Address Line 2</label>
            <input style={inputStyle} value={form.line2} onChange={e => setForm(p => ({ ...p, line2: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' }}>City</label>
            <input style={inputStyle} value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
            {errors.city && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>{errors.city}</span>}
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' }}>District</label>
            <input style={inputStyle} value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} />
            {errors.district && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>{errors.district}</span>}
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' }}>State</label>
            <select style={inputStyle} value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}>
              <option value="">Select</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>{errors.state}</span>}
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2, display: 'block' }}>Tag</label>
            <select style={inputStyle} value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}>
              {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))} />
              Set as default address
            </label>
          </div>
        </div>
      </Modal>
    </div>
  )
}
