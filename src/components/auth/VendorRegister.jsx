import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'

const STEPS = ['Business Details', 'Owner Details', 'Certifications', 'Bank Details', 'Product Categories', 'Review & Submit']
const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']
const SALT_CATEGORIES = ['Rock Salt', 'Sea Salt', 'Iodized Salt', 'Sendha Namak', 'Black Salt', 'Industrial Salt', 'Organic Salt', 'Flavoured Salt']

const initialForm = {
  companyName: '', companyType: 'private-limited', address: '', city: '', state: '', contactPhone: '', contactEmail: '',
  ownerName: '', ownerPhone: '', ownerEmail: '', pan: '',
  gstCert: null, fssaiCert: null, otherCert: null,
  accountNumber: '', ifsc: '', bankName: '',
  categories: [],
}

export default function VendorRegister() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const fileInputRefs = {
    gstCert: useRef(null),
    fssaiCert: useRef(null),
    otherCert: useRef(null),
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleFileDrop = (field, e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0]
    if (file) handleChange(field, file)
  }

  const openFilePicker = (field) => {
    fileInputRefs[field]?.current?.click()
  }

  const validateStep = (s) => {
    const e = {}
    if (s === 0) {
      if (!form.companyName.trim()) e.companyName = 'Required'
      if (!form.address.trim()) e.address = 'Required'
      if (!form.city.trim()) e.city = 'Required'
      if (!form.state) e.state = 'Select state'
      if (!form.contactPhone || !/^[6-9]\d{9}$/.test(form.contactPhone)) e.contactPhone = 'Valid 10-digit phone'
      if (!form.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) e.contactEmail = 'Valid email'
    } else if (s === 1) {
      if (!form.ownerName.trim()) e.ownerName = 'Required'
      if (!form.ownerPhone || !/^[6-9]\d{9}$/.test(form.ownerPhone)) e.ownerPhone = 'Valid 10-digit phone'
      if (!form.ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)) e.ownerEmail = 'Valid email'
      if (!form.pan || !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(form.pan.toUpperCase())) e.pan = 'Valid PAN (e.g. ABCDE1234F)'
    } else if (s === 2) {
      if (!form.gstCert) e.gstCert = 'GST certificate is required'
    } else if (s === 3) {
      if (!form.accountNumber || form.accountNumber.length < 9) e.accountNumber = 'Valid account number'
      if (!form.ifsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.toUpperCase())) e.ifsc = 'Valid IFSC (e.g. SBIN0001234)'
      if (!form.bankName.trim()) e.bankName = 'Required'
    } else if (s === 4) {
      if (form.categories.length === 0) e.categories = 'Select at least one category'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) setStep(prev => Math.min(prev + 1, STEPS.length - 1))
  }

  const handlePrev = () => setStep(prev => Math.max(prev - 1, 0))

  const handleSubmit = () => {
    if (!validateStep(step)) return
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '2px solid var(--border)',
    borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.875rem',
    transition: 'border-color 0.15s',
  }
  const labelStyle = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }

  const renderDragDrop = (field, label) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => handleFileDrop(field, e)}
        onClick={() => openFilePicker(field)}
        style={{
          border: `2px dashed ${form[field] ? 'var(--success)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)', padding: 'var(--space-2xl)',
          textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
          background: form[field] ? 'var(--success-light)' : 'var(--bg-gray)',
        }}
        onDragEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
        onDragLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <input ref={fileInputRefs[field]} type="file" style={{ display: 'none' }} onChange={e => handleFileDrop(field, e)} accept=".pdf,.jpg,.jpeg,.png" />
        {form[field] ? (
          <div>
            <Icon name="check" size={32} color="var(--success)" style={{ margin: '0 auto 8px', display: 'block' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)' }}>{form[field].name}</span>
          </div>
        ) : (
          <div>
            <Icon name="upload" size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px', display: 'block' }} />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Drag & drop or <span style={{ color: 'var(--text-link)', fontWeight: 600 }}>browse</span></span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>PDF, JPG or PNG (max 10MB)</span>
          </div>
        )}
      </div>
      {errors[field] && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors[field]}</span>}
    </div>
  )

  if (submitted) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Icon name="checkCircle" size={36} color="var(--success)" />
        </div>
        <h3 style={{ marginBottom: 8 }}>Application Submitted!</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: 'var(--space-xl)' }}>
          Your vendor application has been submitted for review. Our team will review your documents and get back to you within <strong>2-3 business days</strong>.
        </p>
        <div style={{ padding: '14px 16px', background: 'var(--info-light)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xl)', fontSize: '0.875rem', color: 'var(--info)' }}>
          <Icon name="info" size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          You will receive an email confirmation at <strong>{form.contactEmail}</strong>
        </div>
        <Link to="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
        <h3>Become a Samriddhi Vendor</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Set up your seller account in a few steps</p>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-2xl)' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 3,
            background: i <= step ? 'var(--primary)' : 'var(--border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)' }}>Step {step + 1} of {STEPS.length}</span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{STEPS[step]}</span>
      </div>

      <div className="card" style={{ padding: 'var(--space-2xl)' }}>
        {/* Step 0: Business Details */}
        {step === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Company Name *</label>
              <input style={inputStyle} placeholder="e.g. Himalayan Salts Pvt Ltd" value={form.companyName} onChange={e => handleChange('companyName', e.target.value)} />
              {errors.companyName && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.companyName}</span>}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Company Type *</label>
              <select style={inputStyle} value={form.companyType} onChange={e => handleChange('companyType', e.target.value)}>
                <option value="private-limited">Private Limited</option>
                <option value="public-limited">Public Limited</option>
                <option value="partnership">Partnership</option>
                <option value="proprietorship">Sole Proprietorship</option>
                <option value="llp">LLP</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Business Address *</label>
              <input style={inputStyle} placeholder="Full address" value={form.address} onChange={e => handleChange('address', e.target.value)} />
              {errors.address && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.address}</span>}
            </div>
            <div>
              <label style={labelStyle}>City *</label>
              <input style={inputStyle} placeholder="City" value={form.city} onChange={e => handleChange('city', e.target.value)} />
              {errors.city && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.city}</span>}
            </div>
            <div>
              <label style={labelStyle}>State *</label>
              <select style={inputStyle} value={form.state} onChange={e => handleChange('state', e.target.value)}>
                <option value="">Select</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.state}</span>}
            </div>
            <div>
              <label style={labelStyle}>Contact Phone *</label>
              <input type="tel" style={inputStyle} placeholder="10-digit phone" value={form.contactPhone} onChange={e => handleChange('contactPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
              {errors.contactPhone && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.contactPhone}</span>}
            </div>
            <div>
              <label style={labelStyle}>Contact Email *</label>
              <input type="email" style={inputStyle} placeholder="business@example.com" value={form.contactEmail} onChange={e => handleChange('contactEmail', e.target.value)} />
              {errors.contactEmail && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.contactEmail}</span>}
            </div>
          </div>
        )}

        {/* Step 1: Owner Details */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Owner Full Name *</label>
              <input style={inputStyle} placeholder="Full name" value={form.ownerName} onChange={e => handleChange('ownerName', e.target.value)} />
              {errors.ownerName && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.ownerName}</span>}
            </div>
            <div>
              <label style={labelStyle}>Owner Phone *</label>
              <input type="tel" style={inputStyle} placeholder="10-digit phone" value={form.ownerPhone} onChange={e => handleChange('ownerPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
              {errors.ownerPhone && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.ownerPhone}</span>}
            </div>
            <div>
              <label style={labelStyle}>Owner Email *</label>
              <input type="email" style={inputStyle} placeholder="owner@example.com" value={form.ownerEmail} onChange={e => handleChange('ownerEmail', e.target.value)} />
              {errors.ownerEmail && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.ownerEmail}</span>}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>PAN Number *</label>
              <input style={{ ...inputStyle, textTransform: 'uppercase' }} placeholder="ABCDE1234F" value={form.pan} onChange={e => handleChange('pan', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} />
              {errors.pan && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.pan}</span>}
            </div>
          </div>
        )}

        {/* Step 2: Certifications */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {renderDragDrop('gstCert', 'GST Certificate *')}
            {renderDragDrop('fssaiCert', 'FSSAI License')}
            {renderDragDrop('otherCert', 'Other Certifications (optional)')}
          </div>
        )}

        {/* Step 3: Bank Details */}
        {step === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Account Number *</label>
              <input style={inputStyle} placeholder="Bank account number" value={form.accountNumber} onChange={e => handleChange('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 18))} />
              {errors.accountNumber && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.accountNumber}</span>}
            </div>
            <div>
              <label style={labelStyle}>IFSC Code *</label>
              <input style={{ ...inputStyle, textTransform: 'uppercase' }} placeholder="SBIN0001234" value={form.ifsc} onChange={e => handleChange('ifsc', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11))} />
              {errors.ifsc && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.ifsc}</span>}
            </div>
            <div>
              <label style={labelStyle}>Bank Name *</label>
              <input style={inputStyle} placeholder="e.g. State Bank of India" value={form.bankName} onChange={e => handleChange('bankName', e.target.value)} />
              {errors.bankName && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.bankName}</span>}
            </div>
          </div>
        )}

        {/* Step 4: Product Categories */}
        {step === 4 && (
          <div>
            <label style={labelStyle}>Select the salt categories you deal in *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
              {SALT_CATEGORIES.map(cat => (
                <label key={cat} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                  border: `2px solid ${form.categories.includes(cat) ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.875rem',
                  background: form.categories.includes(cat) ? 'var(--primary-light)' : 'var(--bg-white)',
                  transition: 'all 0.15s',
                }}>
                  <input type="checkbox" checked={form.categories.includes(cat)} onChange={e => {
                    if (e.target.checked) handleChange('categories', [...form.categories, cat])
                    else handleChange('categories', form.categories.filter(c => c !== cat))
                  }} />
                  {cat}
                </label>
              ))}
            </div>
            {errors.categories && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'block', marginTop: 8 }}>{errors.categories}</span>}
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div>
            <h5 style={{ marginBottom: 'var(--space-lg)' }}>Review Your Application</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Section label="Business Details">
                <div><strong>Company:</strong> {form.companyName}</div>
                <div><strong>Type:</strong> {form.companyType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                <div><strong>Address:</strong> {form.address}, {form.city}, {form.state}</div>
                <div><strong>Contact:</strong> {form.contactPhone}, {form.contactEmail}</div>
              </Section>
              <Section label="Owner Details">
                <div><strong>Name:</strong> {form.ownerName}</div>
                <div><strong>Phone:</strong> {form.ownerPhone}</div>
                <div><strong>Email:</strong> {form.ownerEmail}</div>
                <div><strong>PAN:</strong> {form.pan}</div>
              </Section>
              <Section label="Documents">
                <div><strong>GST:</strong> {form.gstCert?.name || 'Uploaded'}</div>
                <div><strong>FSSAI:</strong> {form.fssaiCert?.name || 'Not provided'}</div>
                <div><strong>Other:</strong> {form.otherCert?.name || 'Not provided'}</div>
              </Section>
              <Section label="Bank Account">
                <div><strong>A/C:</strong> {'••••' + form.accountNumber.slice(-4)}</div>
                <div><strong>IFSC:</strong> {form.ifsc}</div>
                <div><strong>Bank:</strong> {form.bankName}</div>
              </Section>
              <Section label="Product Categories">
                <div>{form.categories.join(', ')}</div>
              </Section>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2xl)' }}>
          <div>
            {step > 0 && <Button variant="ghost" onClick={handlePrev} icon={<Icon name="chevronLeft" size={16} />}>Previous</Button>}
          </div>
          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext} icon={<Icon name="chevronRight" size={16} />}>Next Step</Button>
          ) : (
            <Button onClick={handleSubmit} size="lg">Submit for Review</Button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .card > div:first-child { grid-template-columns: 1fr !important; }
          .card > div:first-child > div { grid-column: span 1 !important; }
        }
      `}</style>
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', background: 'var(--bg-gray)', fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ padding: '12px 14px', fontSize: '0.875rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </div>
  )
}
