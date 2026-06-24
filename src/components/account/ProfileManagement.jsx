import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'

export default function ProfileManagement() {
  const { user, setUser, showToast } = useApp()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
    gstin: user?.gstin || '',
    photo: user?.photo || null,
    emailNotifs: true,
    smsNotifs: true,
    whatsappNotifs: false,
    promoNotifs: true,
  })
  const [passwordSection, setPasswordSection] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => handleChange('photo', reader.result)
      reader.readAsDataURL(file)
    }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Invalid phone'
    if (form.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[A-Z0-9]{1}$/.test(form.gstin.toUpperCase())) e.gstin = 'Invalid GSTIN format'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      setUser({ ...user, ...form })
      showToast('Profile updated successfully!', 'success')
      setSaving(false)
    }, 1000)
  }

  const handleChangePassword = () => {
    const e = {}
    if (!passwords.current) e.current = 'Required'
    if (!passwords.newPwd || passwords.newPwd.length < 6) e.newPwd = 'Min 6 characters'
    if (passwords.newPwd !== passwords.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    if (Object.keys(e).length > 0) return
    showToast('Password changed successfully!', 'success')
    setPasswords({ current: '', newPwd: '', confirm: '' })
    setPasswordSection(false)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '2px solid var(--border)',
    borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.875rem',
    transition: 'border-color 0.15s',
  }

  const checkStyle = { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 640, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 'var(--space-2xl)' }}>Profile Settings</h3>

      <div className="card" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 'var(--space-2xl)' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
              background: 'var(--bg-gray)', border: '3px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {form.photo ? (
                <img src={form.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>
                  {form.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            <button onClick={() => fileRef.current?.click()} style={{
              position: 'absolute', bottom: 0, right: 0, width: 28, height: 28,
              borderRadius: '50%', background: 'var(--primary)', color: 'white',
              border: '2px solid white', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{form.name || 'Your Name'}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{form.email || 'Add your email'}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Full Name</label>
            <input style={inputStyle} value={form.name} onChange={e => handleChange('name', e.target.value)} />
            {errors.name && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.name}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Email</label>
            <input type="email" style={inputStyle} value={form.email} onChange={e => handleChange('email', e.target.value)} />
            {errors.email && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.email}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Phone</label>
            <input type="tel" style={inputStyle} value={form.phone} onChange={e => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
            {errors.phone && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.phone}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Business Name</label>
            <input style={inputStyle} value={form.businessName} onChange={e => handleChange('businessName', e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>GSTIN</label>
            <input style={{ ...inputStyle, textTransform: 'uppercase' }} value={form.gstin} onChange={e => handleChange('gstin', e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" />
            {errors.gstin && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.gstin}</span>}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}>
        <h5 style={{ marginBottom: 'var(--space-lg)' }}>Communication Preferences</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={checkStyle}>
            <input type="checkbox" checked={form.emailNotifs} onChange={e => handleChange('emailNotifs', e.target.checked)} />
            Email notifications for orders and updates
          </label>
          <label style={checkStyle}>
            <input type="checkbox" checked={form.smsNotifs} onChange={e => handleChange('smsNotifs', e.target.checked)} />
            SMS alerts for order status
          </label>
          <label style={checkStyle}>
            <input type="checkbox" checked={form.whatsappNotifs} onChange={e => handleChange('whatsappNotifs', e.target.checked)} />
            WhatsApp updates
          </label>
          <label style={checkStyle}>
            <input type="checkbox" checked={form.promoNotifs} onChange={e => handleChange('promoNotifs', e.target.checked)} />
            Promotional emails and offers
          </label>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: passwordSection ? 'var(--space-lg)' : 0 }}>
          <h5 style={{ fontSize: '1rem' }}>Change Password</h5>
          <button onClick={() => setPasswordSection(!passwordSection)} style={{ fontSize: '0.8125rem', color: 'var(--text-link)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            {passwordSection ? 'Cancel' : 'Change'}
          </button>
        </div>
        {passwordSection && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="password" style={inputStyle} placeholder="Current password" value={passwords.current} onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))} />
            {errors.current && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.current}</span>}
            <input type="password" style={inputStyle} placeholder="New password" value={passwords.newPwd} onChange={e => setPasswords(prev => ({ ...prev, newPwd: e.target.value }))} />
            {errors.newPwd && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.newPwd}</span>}
            <input type="password" style={inputStyle} placeholder="Confirm new password" value={passwords.confirm} onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))} />
            {errors.confirm && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.confirm}</span>}
            <Button size="sm" onClick={handleChangePassword} style={{ alignSelf: 'flex-start' }}>Update Password</Button>
          </div>
        )}
      </div>

      <Button block size="lg" onClick={handleSave} loading={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
    </div>
  )
}
