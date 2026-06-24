import { useState, useMemo } from 'react'
import Button from '../common/Button'
import Badge from '../common/Badge'
import StarRating from '../common/StarRating'
import ReviewHelpfulness from './ReviewHelpfulness'
import ReviewForm from './ReviewForm'
import { useApp } from '../../context/AppContext'
import Icon from '../../components/common/Icons'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' },
  { value: 'helpful', label: 'Most Helpful' },
]

export default function ProductReviews({ product, reviews: propReviews, vendorId }) {
  const { user, showToast } = useApp()
  const [sortBy, setSortBy] = useState('recent')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [localReviews, setLocalReviews] = useState(propReviews || [])
  const perPage = 5

  const allReviews = useMemo(() => localReviews.length > 0 ? localReviews : (propReviews || []), [localReviews, propReviews])

  const avgRating = useMemo(() => {
    if (allReviews.length === 0) return 0
    return allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
  }, [allReviews])

  const distribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    allReviews.forEach(r => { if (dist[r.rating] !== undefined) dist[r.rating]++ })
    return dist
  }, [allReviews])

  const sorted = useMemo(() => {
    const copy = [...allReviews]
    switch (sortBy) {
      case 'highest': return copy.sort((a, b) => b.rating - a.rating)
      case 'lowest': return copy.sort((a, b) => a.rating - b.rating)
      case 'helpful': return copy.sort((a, b) => (b.likes || 0) - (a.likes || 0))
      default: return copy.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  }, [allReviews, sortBy])

  const paged = sorted.slice(0, page * perPage)
  const totalPages = Math.ceil(sorted.length / perPage)

  const handleNewReview = (review) => {
    setLocalReviews([review, ...localReviews])
    showToast('Review submitted!', 'success')
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', minWidth: 140 }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)' }}>
            {avgRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(avgRating)} size={16} />
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>{allReviews.length} reviews</p>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          {[5, 4, 3, 2, 1].map(star => {
            const count = distribution[star]
            const pct = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', width: 24, textAlign: 'right' }}>{star}</span>
                <Icon name="faStar" size={12} color="var(--accent)" />
                <div style={{
                  flex: 1, height: 8, borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-gray)', overflow: 'hidden',
                }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 'var(--radius-full)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 30 }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => { setSortBy(opt.value); setPage(1) }} style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)',
              background: sortBy === opt.value ? 'var(--primary)' : 'var(--bg-gray)',
              color: sortBy === opt.value ? '#fff' : 'var(--text-secondary)',
              border: 'none', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}>{opt.label}</button>
          ))}
        </div>
        <Button variant="primary" size="sm" icon={<Icon name="edit" size={14} />} onClick={() => setShowForm(true)}>
          Write a Review
        </Button>
      </div>

      {paged.map(review => (
        <div key={review.id} style={{
          padding: 'var(--space-lg)', marginBottom: 'var(--space-md)',
          background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--primary-light)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.875rem',
              }}>
                {getInitials(review.reviewerName)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{review.reviewerName}</span>
                  {review.isVerified && (
                    <Badge variant="success" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>
                      <Icon name="check" size={10} />
                      {' '}Verified Purchase
                    </Badge>
                  )}
                </div>
                <StarRating rating={review.rating} size={14} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 6 }}>{formatDate(review.date)}</span>
              </div>
            </div>
          </div>

          {review.title && <h5 style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.9375rem' }}>{review.title}</h5>}
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>{review.body}</p>

          {review.pros && review.pros.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
              {review.pros.map(p => <span key={p} style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--success-light)', color: 'var(--success)', fontSize: '0.6875rem', fontWeight: 500 }}>+{p}</span>)}
            </div>
          )}
          {review.cons && review.cons.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
              {review.cons.map(c => <span key={c} style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '0.6875rem', fontWeight: 500 }}>-{c}</span>)}
            </div>
          )}

          {review.photos && review.photos.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              {review.photos.map((photo, i) => (
                <img key={i} src={photo} alt={`Review photo ${i + 1}`} style={{
                  width: 60, height: 60, borderRadius: 'var(--radius-sm)',
                  objectFit: 'cover', cursor: 'pointer', border: '1px solid var(--border)',
                }} />
              ))}
            </div>
          )}

          <div style={{ marginTop: 8 }}>
            <ReviewHelpfulness reviewId={review.id} initialLikes={review.likes || 0} />
          </div>

          {review.vendorReply && (
            <div style={{
              marginTop: 12, padding: 'var(--space-md)',
              background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--primary)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>
                Vendor Response
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>{review.vendorReply}</p>
            </div>
          )}
        </div>
      ))}

      {paged.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="messageSquare" size={24} /></div>
          <div className="empty-state-title">No reviews yet</div>
          <div className="empty-state-text">Be the first to review this product.</div>
        </div>
      )}

      {paged.length < sorted.length && (
        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          <Button variant="secondary" onClick={() => setPage(page + 1)}>
            Show More Reviews ({sorted.length - paged.length} remaining)
          </Button>
        </div>
      )}

      <ReviewForm isOpen={showForm} onClose={() => setShowForm(false)} product={product} vendorId={vendorId} onSubmit={handleNewReview} />
    </div>
  )
}
