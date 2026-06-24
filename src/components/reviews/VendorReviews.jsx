import { useState, useMemo } from 'react'
import StarRating from '../common/StarRating'
import Badge from '../common/Badge'
import Icon from '../../components/common/Icons'

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const CATEGORIES = [
  { key: 'productQuality', label: 'Product Quality' },
  { key: 'packaging', label: 'Packaging' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'communication', label: 'Communication' },
]

const FILTER_RATINGS = [0, 1, 2, 3, 4, 5]

export default function VendorReviews({ vendor, reviews: propReviews }) {
  const [filterRating, setFilterRating] = useState(0)
  const [replyText, setReplyText] = useState({})
  const [vendorReplies, setVendorReplies] = useState({})

  const reviews = propReviews || []

  const categoryScores = useMemo(() => {
    if (reviews.length === 0) return CATEGORIES.map(c => ({ ...c, score: 0 }))
    return CATEGORIES.map(c => {
      let total = 0
      let count = 0
      reviews.forEach(r => {
        if (r[c.key]) { total += r[c.key]; count++ }
      })
      return { ...c, score: count > 0 ? total / count : 0 }
    })
  }, [reviews])

  const distribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(r => { if (dist[r.rating]) dist[r.rating]++ })
    return dist
  }, [reviews])

  const overallRating = useMemo(() => {
    if (reviews.length === 0) return 0
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  }, [reviews])

  const filtered = useMemo(() => {
    if (filterRating === 0) return reviews
    return reviews.filter(r => r.rating === filterRating)
  }, [reviews, filterRating])

  const handleReply = (reviewId) => {
    if (!replyText[reviewId]?.trim()) return
    setVendorReplies({ ...vendorReplies, [reviewId]: replyText[reviewId].trim() })
    setReplyText({ ...replyText, [reviewId]: '' })
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', minWidth: 140 }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)' }}>
            {overallRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(overallRating)} size={16} />
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>{reviews.length} reviews</p>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          {[5, 4, 3, 2, 1].map(star => {
            const count = distribution[star] || 0
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', width: 24, textAlign: 'right' }}>{star}</span>
                <Icon name="faStar" size={12} color="var(--accent)" />
                <div style={{ flex: 1, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--bg-gray)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 'var(--radius-full)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 30 }}>{count}</span>
              </div>
            )
          })}
        </div>

        <div style={{ minWidth: 180 }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Category Scores</p>
          {categoryScores.map(cat => (
            <div key={cat.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.label}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <StarRating rating={Math.round(cat.score)} size={12} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{cat.score > 0 ? cat.score.toFixed(1) : '-'}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {FILTER_RATINGS.map(r => (
          <button key={r} onClick={() => setFilterRating(r)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-full)',
            background: filterRating === r ? 'var(--primary)' : 'var(--bg-gray)',
            color: filterRating === r ? '#fff' : 'var(--text-secondary)',
            border: 'none', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}>
            {r === 0 ? 'All' : `${r} Star${r > 1 ? 's' : ''}`}
          </button>
        ))}
      </div>

      {filtered.map(review => (
        <div key={review.id} style={{
          padding: 'var(--space-lg)', marginBottom: 'var(--space-md)',
          background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--info-light)', color: 'var(--info)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8125rem',
            }}>
              {getInitials(review.reviewerName)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{review.reviewerName}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(review.date)}</span>
              </div>
              <StarRating rating={review.rating} size={14} />
            </div>
          </div>

          {review.title && <h5 style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.9375rem' }}>{review.title}</h5>}
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{review.body}</p>

          {vendorReplies[review.id] && (
            <div style={{
              marginTop: 8, padding: 'var(--space-md)',
              background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--primary)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>
                Your Reply
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>{vendorReplies[review.id]}</p>
            </div>
          )}

          {!vendorReplies[review.id] && (
            <div style={{ marginTop: 8 }}>
              <textarea value={replyText[review.id] || ''} onChange={e => setReplyText({ ...replyText, [review.id]: e.target.value })} placeholder="Reply to this review..." rows={2} style={{
                width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                border: '2px solid var(--border)', fontSize: '0.8125rem', outline: 'none',
                resize: 'vertical', background: 'var(--bg-white)', boxSizing: 'border-box',
              }} />
              <button onClick={() => handleReply(review.id)} disabled={!replyText[review.id]?.trim()} style={{
                marginTop: 4, padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                background: replyText[review.id]?.trim() ? 'var(--primary)' : 'var(--border)',
                color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: replyText[review.id]?.trim() ? 'pointer' : 'not-allowed',
              }}>Post Reply</button>
            </div>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="faStar" size={24} /></div>
          <div className="empty-state-title">No reviews found</div>
          <div className="empty-state-text">No reviews match the selected filter.</div>
        </div>
      )}
    </div>
  )
}
