import { useState } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Modal from '../common/Modal'
import { useApp } from '../../context/AppContext'

const RETURN_STATUSES = [
  { key: 'requested', label: 'Requested', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'approved', label: 'Approved', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'pickup_scheduled', label: 'Pickup Scheduled', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { key: 'picked_up', label: 'Picked Up', icon: 'M5 13l4 4L19 7' },
  { key: 'refund_initiated', label: 'Refund Initiated', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'refunded', label: 'Refunded', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
]

const REASONS = [
  'Wrong product delivered',
  'Damaged in transit',
  'Quality issue',
  'Expired or near expiry',
  'Missing items',
  'Other',
]

const INITIAL_FORM = { items: [], reason: '', description: '', photos: [] }

export default function ReturnRefund() {
  const { orders, user, showToast } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [viewingReturn, setViewingReturn] = useState(null)
  const [returnRequests, setReturnRequests] = useState([])

  const deliveredOrders = orders.filter(o => o.status === 'delivered')

  const handleSubmitReturn = () => {
    const errs = {}
    if (form.items.length === 0) errs.items = 'Select at least one item'
    if (!form.reason) errs.reason = 'Select a reason'
    if (!form.description.trim()) errs.description = 'Provide a description'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const newReturn = {
      id: `RET${Date.now()}`,
      items: form.items,
      reason: form.reason,
      description: form.description,
      photos: form.photos,
      date: new Date().toISOString(),
      status: 'requested',
      refundAmount: form.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }
    setReturnRequests([newReturn, ...returnRequests])
    setShowForm(false)
    setForm(INITIAL_FORM)
    showToast('Return request submitted successfully', 'success')
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    const remaining = 5 - form.photos.length
    const toAdd = files.slice(0, remaining).map(f => URL.createObjectURL(f))
    setForm({ ...form, photos: [...form.photos, ...toAdd] })
  }

  const removePhoto = (index) => {
    setForm({ ...form, photos: form.photos.filter((_, i) => i !== index) })
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Returns & Refunds</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Raise return requests within 48 hours of delivery</p>
        </div>
        {deliveredOrders.length > 0 && (
          <Button variant="primary" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          } onClick={() => setShowForm(true)}>
            Raise Return
          </Button>
        )}
      </div>

      {!user && (
        <Card padding="var(--space-xl)"><p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: 0 }}>Please log in to manage returns and refunds.</p></Card>
      )}

      {returnRequests.length === 0 && user && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <div className="empty-state-title">No return requests</div>
          <div className="empty-state-text">You haven't raised any return requests yet.</div>
        </div>
      )}

      {returnRequests.map((rq, idx) => (
        <Card key={rq.id} padding="var(--space-lg)" style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{rq.id}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                {new Date(rq.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <Badge variant={
              rq.status === 'refunded' ? 'success' :
              rq.status === 'approved' ? 'info' :
              rq.status === 'requested' ? 'warning' : 'primary'
            }>
              {RETURN_STATUSES.find(s => s.key === rq.status)?.label || rq.status}
            </Badge>
          </div>

          {rq.items.length > 0 && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
              Items: {rq.items.map(i => i.productName).join(', ')}
            </div>
          )}
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
            Reason: {rq.reason}
          </div>
          {rq.refundAmount > 0 && (
            <div style={{
              background: 'var(--success-light)', borderRadius: 'var(--radius-sm)',
              padding: '8px 12px', display: 'inline-block', marginTop: 8,
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Refund Amount: </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>₹{rq.refundAmount}</span>
            </div>
          )}

          {rq.status !== 'refunded' && rq.status !== 'closed' && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                {RETURN_STATUSES.map((s, i) => {
                  const currentIdx = RETURN_STATUSES.findIndex(x => x.key === rq.status)
                  const isCompleted = i < currentIdx
                  const isActive = i === currentIdx
                  return (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isCompleted ? 'var(--success-light)' : isActive ? 'var(--primary-light)' : 'var(--bg-gray)',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={
                          isCompleted ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--text-muted)'
                        } strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d={s.icon} />
                        </svg>
                      </div>
                      {i < RETURN_STATUSES.length - 1 && (
                        <div style={{
                          width: 16, height: 2,
                          background: i < currentIdx ? 'var(--success)' : 'var(--border)',
                        }} />
                      )}
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                {RETURN_STATUSES.map(s => (
                  <span key={s.key} style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textAlign: 'center', flex: 1 }}>{s.label}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <Button variant="ghost" size="sm" icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            } onClick={() => showToast('Contacting support...', 'info')}>
              Contact Support
            </Button>
          </div>
        </Card>
      ))}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setForm(INITIAL_FORM); setErrors({}) }} title="Raise a Return Request">
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 8 }}>Select Items to Return</label>
          {deliveredOrders.flatMap(o => o.items.map((item, i) => (
            <label key={`${o.id}-${i}`} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
              fontSize: '0.875rem', cursor: 'pointer',
            }}>
              <input type="checkbox" checked={form.items.some(fi => fi.productId === item.productId)} onChange={() => {
                const exists = form.items.find(fi => fi.productId === item.productId)
                setForm({
                  ...form,
                  items: exists
                    ? form.items.filter(fi => fi.productId !== item.productId)
                    : [...form.items, { ...item, productId: item.productId || item.product?.id }],
                })
              }} style={{ accentColor: 'var(--primary)' }} />
              {item.productName || item.product?.name} (x{item.quantity}) - ₹{item.price * item.quantity}
            </label>
          )))}
          {errors.items && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>{errors.items}</p>}
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Reason for Return</label>
          <select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} style={{
            width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
            border: `2px solid ${errors.reason ? 'var(--danger)' : 'var(--border)'}`,
            fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none',
            background: 'var(--bg-white)',
          }}>
            <option value="">Select a reason</option>
            {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.reason && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>{errors.reason}</p>}
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the issue in detail..." style={{
            width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
            border: `2px solid ${errors.description ? 'var(--danger)' : 'var(--border)'}`,
            fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none',
            resize: 'vertical', background: 'var(--bg-white)',
          }} />
          {errors.description && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>{errors.description}</p>}
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 8 }}>
            Photos (up to 5, optional)
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {form.photos.map((photo, i) => (
              <div key={i} style={{
                width: 64, height: 64, borderRadius: 'var(--radius-sm)',
                overflow: 'hidden', position: 'relative', border: '1px solid var(--border)',
              }}>
                <img src={photo} alt={`Upload ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => removePhoto(i)} style={{
                  position: 'absolute', top: 2, right: 2, width: 20, height: 20,
                  borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', border: 'none', cursor: 'pointer',
                }}>×</button>
              </div>
            ))}
            {form.photos.length < 5 && (
              <label style={{
                width: 64, height: 64, borderRadius: 'var(--radius-sm)',
                border: '2px dashed var(--border)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)',
              }}>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                +
              </label>
            )}
          </div>
        </div>

        <Button variant="primary" block onClick={handleSubmitReturn}>Submit Return Request</Button>
      </Modal>
    </div>
  )
}
