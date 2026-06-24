import { useMemo } from 'react'
import Badge from '../common/Badge'
import { useApp } from '../../context/AppContext'

const NOTIFICATION_CONFIG = {
  order: { icon: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z', bg: 'var(--primary-light)', color: 'var(--primary)', label: 'Order' },
  vendor: { icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', bg: 'var(--info-light)', color: 'var(--info)', label: 'Vendor' },
  price: { icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', bg: 'var(--warning-light)', color: 'var(--warning)', label: 'Price Drop' },
  deal: { icon: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', bg: 'var(--success-light)', color: 'var(--success)', label: 'Deal' },
  system: { icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01', bg: 'var(--bg-gray)', color: 'var(--text-secondary)', label: 'System' },
}

export default function NotificationList({ compact }) {
  const { notifications, showToast } = useApp()

  const grouped = useMemo(() => {
    if (compact) return notifications.slice(0, 5)
    return notifications
  }, [notifications, compact])

  const getConfig = (type) => NOTIFICATION_CONFIG[type] || NOTIFICATION_CONFIG.system

  const handleMarkAllRead = () => {
    showToast('All notifications marked as read', 'success')
  }

  if (notifications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔔</div>
        <div className="empty-state-title">No notifications</div>
        <div className="empty-state-text">You're all caught up! Check back later for updates.</div>
      </div>
    )
  }

  return (
    <div>
      {!compact && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Notifications</h3>
          <button onClick={handleMarkAllRead} style={{
            fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600,
            border: 'none', background: 'none', cursor: 'pointer', padding: '6px 12px',
            borderRadius: 'var(--radius-sm)', transition: 'background var(--transition-fast)',
          }}>
            Mark all as read
          </button>
        </div>
      )}

      {grouped.map((n, i) => {
        const cfg = getConfig(n.type)
        return (
          <div key={n.id || i} style={{
            display: 'flex', gap: 12, padding: 'var(--space-md) var(--space-lg)',
            borderBottom: '1px solid var(--border-light)',
            background: n.read ? 'transparent' : 'var(--primary-light)',
            borderRadius: compact ? 'var(--radius-md)' : 0,
            cursor: 'pointer', transition: 'background var(--transition-fast)',
            marginBottom: compact ? 4 : 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-full)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: cfg.bg, color: cfg.color, flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={cfg.icon} />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                {n.type && <Badge variant="soft-primary" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>{cfg.label}</Badge>}
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  {n.timestamp ? (() => {
                    const diff = Date.now() - new Date(n.timestamp).getTime()
                    const mins = Math.floor(diff / 60000)
                    if (mins < 1) return 'Just now'
                    if (mins < 60) return mins + 'm ago'
                    const hours = Math.floor(mins / 60)
                    if (hours < 24) return hours + 'h ago'
                    const days = Math.floor(hours / 24)
                    if (days === 1) return 'Yesterday'
                    return days + 'd ago'
                  })() : ''}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0, fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>
                {n.message}
              </p>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 8 }} />}
          </div>
        )
      })}

      {compact && notifications.length > 5 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            +{notifications.length - 5} more notifications
          </span>
        </div>
      )}
    </div>
  )
}
