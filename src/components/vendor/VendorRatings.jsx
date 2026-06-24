import StarRating from '../common/StarRating'

const categoryScores = [
  { label: 'Product Quality', score: 4.6 },
  { label: 'Packaging', score: 4.3 },
  { label: 'Delivery Speed', score: 4.1 },
  { label: 'Communication', score: 4.5 },
]

const breakdown = [
  { stars: 5, percent: 68 },
  { stars: 4, percent: 20 },
  { stars: 3, percent: 7 },
  { stars: 2, percent: 3 },
  { stars: 1, percent: 2 },
]

export default function VendorRatings({ rating = 4.5, reviewCount = 0 }) {
  return (
    <div>
      <h4 style={{ fontSize: '1rem', marginBottom: 16 }}>Ratings & Reviews</h4>

      <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginBottom: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>{rating.toFixed(1)}</span>
          <StarRating rating={rating} size={16} />
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{reviewCount.toLocaleString()} reviews</span>
        </div>

        <div style={{ flex: 1 }}>
          {breakdown.map(item => (
            <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', width: 30 }}>{item.stars} ★</span>
              <div style={{ flex: 1, height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${item.percent}%`, height: '100%', background: 'var(--accent)', borderRadius: 4, transition: 'width 0.5s ease' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <h5 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Category Scores</h5>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {categoryScores.map(cat => (
          <div key={cat.label} style={{
            padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-white)',
          }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{cat.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${(cat.score / 5) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.score.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
