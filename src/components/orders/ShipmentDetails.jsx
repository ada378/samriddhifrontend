import Button from '../common/Button'

export default function ShipmentDetails({ courier, trackingId, dispatchDate, expectedDate, weight, dimensions, onTrack }) {
  if (!trackingId) return null

  const courierUrl = courier?.website || `https://www.google.com/search?q=track+${trackingId}`

  return (
    <div style={{
      background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)', padding: 'var(--space-xl)',
    }}>
      <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 8 }}>
          <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        Shipment Details
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md) var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        {courier && (
          <>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Courier</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-gray)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700,
                  color: 'var(--text-secondary)',
                }}>
                  {courier.logo || courier.name?.charAt(0) || 'C'}
                </div>
                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{courier.name}</span>
              </div>
            </div>
          </>
        )}

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Tracking No.</span>
          <div style={{ marginTop: 4 }}>
            <a href={courierUrl} target="_blank" rel="noopener noreferrer" style={{
              fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-link)',
              textDecoration: 'none',
            }}>
              {trackingId}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginLeft: 4 }}>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>

        {dispatchDate && (
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Dispatched</span>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: '4px 0 0' }}>
              {new Date(dispatchDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}

        {expectedDate && (
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Expected Delivery</span>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: '4px 0 0', color: 'var(--primary)' }}>
              {new Date(expectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}

        {weight && (
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Weight</span>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: '4px 0 0' }}>{weight}</p>
          </div>
        )}

        {dimensions && (
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Dimensions</span>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: '4px 0 0' }}>{dimensions}</p>
          </div>
        )}
      </div>

      <Button variant="secondary" size="sm" onClick={onTrack} icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      }>
        Track on Courier Website
      </Button>
    </div>
  )
}
