import { useMemo } from 'react'

const STATUS_CONFIG = {
  placed: { icon: 'M5 13l4 4L19 7', color: 'var(--primary)', label: 'Order Placed' },
  confirmed: { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'var(--primary)', label: 'Confirmed' },
  packed: { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'var(--warning)', label: 'Packed' },
  dispatched: { icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m2 1l2-1m2 1l2-1m2 1V6m0 0l3 3m0 0l3-3m-3 3v10', color: 'var(--info)', label: 'Dispatched' },
  out_for_delivery: { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', color: 'var(--accent)', label: 'Out for Delivery' },
  delivered: { icon: 'M5 13l4 4L19 7', color: 'var(--success)', label: 'Delivered' },
}

const STATUS_ORDER = ['placed', 'confirmed', 'packed', 'dispatched', 'out_for_delivery', 'delivered']

function formatTimestamp(ts) {
  if (!ts) return null
  const now = new Date()
  const date = new Date(ts)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OrderTimeline({ status = 'placed', events = [] }) {
  const currentIndex = STATUS_ORDER.indexOf(status)

  const mergedEvents = useMemo(() => {
    const eventMap = {}
    events.forEach(e => { eventMap[e.status] = e })
    return STATUS_ORDER.map((s, i) => ({
      ...STATUS_CONFIG[s],
      key: s,
      timestamp: eventMap[s]?.timestamp || null,
      note: eventMap[s]?.note || '',
      state: i < currentIndex ? 'completed' : i === currentIndex ? 'active' : 'pending',
    }))
  }, [status, events, currentIndex])

  return (
    <div style={{ padding: 'var(--space-xl) 0' }}>
      {mergedEvents.map((step, index) => (
        <div key={step.key} style={{ display: 'flex', gap: 16, position: 'relative', minHeight: 72 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step.state === 'pending' ? 'var(--bg-gray)' :
                step.state === 'active' ? 'var(--primary-light)' : 'var(--success-light)',
              border: `2px solid ${step.state === 'pending' ? 'var(--border)' :
                step.state === 'active' ? step.color : 'var(--success)'}`,
              transition: 'all var(--transition-base)',
              position: 'relative', zIndex: 1,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={
                step.state === 'pending' ? 'var(--text-muted)' :
                  step.state === 'active' ? step.color : 'var(--success)'
              } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={step.icon} />
              </svg>
            </div>
            {index < mergedEvents.length - 1 && (
              <div style={{
                width: 2, flex: 1, minHeight: 32,
                background: step.state === 'completed' ? 'var(--success)' :
                  step.state === 'active' ? 'var(--primary)' : 'var(--border)',
                opacity: step.state === 'pending' ? 0.3 : 1,
              }} />
            )}
          </div>
          <div style={{ flex: 1, paddingBottom: index < mergedEvents.length - 1 ? 8 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{
                fontWeight: 600, fontSize: '0.9375rem',
                color: step.state === 'pending' ? 'var(--text-muted)' :
                  step.state === 'active' ? step.color : 'var(--text-primary)',
              }}>{step.label}</span>
              {step.state === 'active' && (
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: step.color,
                  animation: 'pulse 2s infinite',
                }} />
              )}
            </div>
            {step.timestamp && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2, display: 'block' }}>
                {formatTimestamp(step.timestamp)}
              </span>
            )}
            {step.note && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '2px 0 0', lineHeight: 1.4 }}>
                {step.note}
              </p>
            )}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  )
}
