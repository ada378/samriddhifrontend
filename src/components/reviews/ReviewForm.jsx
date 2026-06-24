import { useState } from 'react'
import Button from '../common/Button'
import Modal from '../common/Modal'
import StarRating from '../common/StarRating'
import { useApp } from '../../context/AppContext'
import Icon from '../../components/common/Icons'

export default function ReviewForm({ isOpen, onClose, product, vendorId, onSubmit }) {
  const { user } = useApp()
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [pros, setPros] = useState([])
  const [cons, setCons] = useState([])
  const [proInput, setProInput] = useState('')
  const [conInput, setConInput] = useState('')
  const [photos, setPhotos] = useState([])
  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setRating(0); setTitle(''); setBody(''); setPros([]); setCons([])
    setProInput(''); setConInput(''); setPhotos([]); setErrors({})
  }

  const validate = () => {
    const errs = {}
    if (rating === 0) errs.rating = 'Please select a rating'
    if (!title.trim()) errs.title = 'Title is required'
    if (title.length > 100) errs.title = 'Title must be under 100 characters'
    if (!body.trim()) errs.body = 'Please write a review'
    if (body.length < 20) errs.body = 'Review must be at least 20 characters'
    if (body.length > 2000) errs.body = 'Review must be under 2000 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const review = {
      id: 'R' + Date.now(),
      productId: product?.id,
      vendorId,
      reviewerName: user?.name || 'Anonymous',
      rating,
      title: title.trim(),
      body: body.trim(),
      pros,
      cons,
      photos,
      date: new Date().toISOString(),
      likes: 0,
      isVerified: !!user,
    }
    if (onSubmit) onSubmit(review)
    resetForm()
    onClose()
  }

  const addPro = () => {
    if (proInput.trim() && !pros.includes(proInput.trim())) {
      setPros([...pros, proInput.trim()])
      setProInput('')
    }
  }

  const addCon = () => {
    if (conInput.trim() && !cons.includes(conInput.trim())) {
      setCons([...cons, conInput.trim()])
      setConInput('')
    }
  }

  const removeTag = (arr, setter, item) => setter(arr.filter(t => t !== item))

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    const remaining = 5 - photos.length
    const toAdd = files.slice(0, remaining).map(f => URL.createObjectURL(f))
    setPhotos([...photos, ...toAdd])
  }

  if (!user) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Write a Review">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Icon name="camera" size={48} />
          <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 8 }}>Login to Write a Review</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 320, margin: '0 auto 20px' }}>
            Please sign in to share your experience with this product.
          </p>
          <Button variant="primary" onClick={() => { onClose(); window.location.href = '/login' }}>Log In</Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose() }} title={'Review: ' + (product?.name || 'Product')}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Your Rating *</label>
        <StarRating rating={rating} size={32} interactive onChange={setRating} />
        {errors.rating && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>{errors.rating}</p>}
      </div>

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Review Title *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summarize your experience" maxLength={100} style={{
          width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
          border: '2px solid ' + (errors.title ? 'var(--danger)' : 'var(--border)'),
          fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none',
          background: 'var(--bg-white)',
        }} />
        {errors.title && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>{errors.title}</p>}
      </div>

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Your Review *</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="What did you like or dislike? How was the quality, packaging, delivery?" style={{
          width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
          border: '2px solid ' + (errors.body ? 'var(--danger)' : 'var(--border)'),
          fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none',
          resize: 'vertical', background: 'var(--bg-white)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          {errors.body && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', margin: 0 }}>{errors.body}</p>}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{body.length}/2000</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 'var(--space-lg)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Pros</label>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            <input value={proInput} onChange={e => setProInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPro() } }} placeholder="Add a pro" style={{
              flex: 1, padding: '6px 8px', borderRadius: 'var(--radius-sm)',
              border: '2px solid var(--border)', fontSize: '0.8125rem', outline: 'none',
            }} />
            <button onClick={addPro} style={{
              padding: '6px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--primary)', color: '#fff', border: 'none',
              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
            }}>Add</button>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {pros.map(p => (
              <span key={p} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                background: 'var(--success-light)', color: 'var(--success)',
                fontSize: '0.75rem', fontWeight: 500,
              }}>
                +{p}
                <button onClick={() => removeTag(pros, setPros, p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '0.75rem', padding: 0 }}>&times;</button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Cons</label>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            <input value={conInput} onChange={e => setConInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCon() } }} placeholder="Add a con" style={{
              flex: 1, padding: '6px 8px', borderRadius: 'var(--radius-sm)',
              border: '2px solid var(--border)', fontSize: '0.8125rem', outline: 'none',
            }} />
            <button onClick={addCon} style={{
              padding: '6px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--danger)', color: '#fff', border: 'none',
              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
            }}>Add</button>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {cons.map(c => (
              <span key={c} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                background: 'var(--danger-light)', color: 'var(--danger)',
                fontSize: '0.75rem', fontWeight: 500,
              }}>
                -{c}
                <button onClick={() => removeTag(cons, setCons, c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '0.75rem', padding: 0 }}>&times;</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 8 }}>Photos (up to 5)</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {photos.map((photo, i) => (
            <div key={i} style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
              <img src={photo} alt={'Preview ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} style={{
                position: 'absolute', top: 2, right: 2, width: 20, height: 20,
                borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', border: 'none', cursor: 'pointer',
              }}>&times;</button>
            </div>
          ))}
          {photos.length < 5 && (
            <label style={{
              width: 64, height: 64, borderRadius: 'var(--radius-sm)',
              border: '2px dashed var(--border)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)',
            }}>
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />+
            </label>
          )}
        </div>
      </div>

      <Button variant="primary" block onClick={handleSubmit}>Submit Review</Button>
    </Modal>
  )
}
