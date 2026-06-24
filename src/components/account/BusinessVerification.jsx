import { useState, useRef } from 'react'
import Button from '../common/Button'

const VERIFICATION_STATUSES = {
  not_submitted: { label: 'Not Submitted', color: 'var(--text-muted)', bg: 'var(--bg-gray)' },
  pending: { label: 'Verification Pending', color: 'var(--warning)', bg: 'var(--warning-light)' },
  verified: { label: 'Verified Business', color: 'var(--success)', bg: 'var(--success-light)' },
  rejected: { label: 'Verification Rejected', color: 'var(--danger)', bg: 'var(--danger-light)' },
}

const BENEFITS = [
  { icon: 'M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z', text: 'Preferred pricing on bulk orders' },
  { icon: 'M9 12l2 2 4-4', text: 'Priority customer support' },
  { icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', text: 'Verified badge on your profile' },
  { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', text: 'Access to B2B exclusive deals' },
  { icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', text: 'GST invoice generation' },
]

export default function BusinessVerification() {
  const [status, setStatus] = useState('not_submitted')
  const [documents, setDocuments] = useState({ gst: null, pan: null, fssai: null })
  const [submitting, setSubmitting] = useState(false)
  const fileRefs = { gst: useRef(null), pan: useRef(null), fssai: useRef(null) }

  const current = VERIFICATION_STATUSES[status]

  const handleFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDocuments(prev => ({ ...prev, [field]: { name: file.name, data: reader.result, size: file.size } }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!documents.gst) return
    setSubmitting(true)
    setTimeout(() => {
      setStatus('pending')
      setSubmitting(false)
    }, 1500)
  }

  const renderFileUpload = (field, label, required) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
        {label} {required && '*'}
      </label>
      <div
        onClick={() => fileRefs[field]?.current?.click()}
        style={{
          border: `2px dashed ${documents[field] ? 'var(--success)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)', padding: 'var(--space-xl)',
          textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
          background: documents[field] ? 'var(--success-light)' : 'var(--bg-gray)',
        }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(field, f) }}
      >
        <input ref={fileRefs[field]} type="file" style={{ display: 'none' }} accept=".pdf,.jpg,.jpeg,.png" onChange={e => { const f = e.target.files[0]; if (f) handleFileUpload(field, f) }} />
        {documents[field] ? (
          <div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" style={{ margin: '0 auto 6px', display: 'block' }}><polyline points="20 6 9 17 4 12" /></svg>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--success)' }}>{documents[field].name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(documents[field].size / 1024).toFixed(1)} KB</div>
          </div>
        ) : (
          <div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ margin: '0 auto 6px', display: 'block' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Drag & drop or <span style={{ color: 'var(--text-link)', fontWeight: 600 }}>browse</span></span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>PDF, JPG or PNG (max 10MB)</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: current.bg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 12px',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={current.color} strokeWidth="2">
            {status === 'verified' ? <><polyline points="20 6 9 17 4 12" /></> : <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>}
          </svg>
        </div>
        <h3 style={{ color: current.color }}>{current.label}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 4 }}>
          {status === 'not_submitted' && 'Upload your documents to get verified as a business buyer'}
          {status === 'pending' && 'Your documents are being reviewed. This typically takes 2-3 business days.'}
          {status === 'verified' && 'Your business is verified. Enjoy B2B benefits!'}
          {status === 'rejected' && 'Your verification was rejected. Please upload correct documents.'}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 'var(--space-2xl)' }}>
        {['not_submitted', 'pending', 'verified', 'rejected'].map(s => (
          <div key={s} style={{
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: s === status ? VERIFICATION_STATUSES[s].bg : 'transparent',
            color: s === status ? VERIFICATION_STATUSES[s].color : 'var(--text-muted)',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
            border: `1px solid ${s === status ? VERIFICATION_STATUSES[s].color : 'var(--border)'}`,
          }} onClick={() => setStatus(s)}>
            {VERIFICATION_STATUSES[s].label}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}>
        <h5 style={{ marginBottom: 'var(--space-lg)' }}>Upload Documents</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {renderFileUpload('gst', 'GST Certificate', true)}
          {renderFileUpload('pan', 'Business PAN Card', false)}
          {renderFileUpload('fssai', 'FSSAI License', false)}
        </div>

        {status === 'not_submitted' && (
          <Button block size="lg" style={{ marginTop: 'var(--space-xl)' }} onClick={handleSubmit} loading={submitting} disabled={!documents.gst}>
            {submitting ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        )}

        {status === 'rejected' && (
          <div style={{ marginTop: 'var(--space-xl)' }}>
            <div style={{ padding: '12px 14px', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.8125rem', marginBottom: 'var(--space-lg)' }}>
              <strong>Reason:</strong> The uploaded GST certificate does not match the provided business name. Please upload a valid GST certificate with matching business name.
            </div>
            <Button block size="lg" onClick={handleSubmit}>Re-submit</Button>
          </div>
        )}
      </div>

      {status === 'verified' && (
        <div style={{
          padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)',
          background: 'var(--success-light)', display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 'var(--space-xl)',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--success)' }}>Verified Business</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Your verified badge will appear on your profile and orders.
            </div>
          </div>
          <span className="badge badge-success" style={{ marginLeft: 'auto', fontSize: '0.8125rem', padding: '6px 12px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ verticalAlign: 'middle', marginRight: 4 }}><polyline points="20 6 9 17 4 12" /></svg>
            Verified
          </span>
        </div>
      )}

      <div className="card" style={{ padding: 'var(--space-xl)' }}>
        <h5 style={{ marginBottom: 'var(--space-lg)' }}>Benefits of Business Verification</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BENEFITS.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)',
                background: 'var(--success-light)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round"><path d={b.icon} /></svg>
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
