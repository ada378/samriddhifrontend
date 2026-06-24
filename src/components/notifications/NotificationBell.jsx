import { useState, useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import Icon from '../../components/common/Icons'

export default function NotificationBell({ onViewAll }) {
  const { notifications } = useApp()
  const [showPanel, setShowPanel] = useState(false)
  const ref = useRef(null)

  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowPanel(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button onClick={() => setShowPanel(!showPanel)} style={{
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 40, height: 40, borderRadius: 'var(--radius-full)',
        background: showPanel ? 'var(--primary-light)' : 'transparent',
        color: showPanel ? 'var(--primary)' : 'var(--text-secondary)',
        border: 'none', cursor: 'pointer', transition: 'all var(--transition-fast)',
      }}>
        <Icon name="bell" size={20} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16,
            borderRadius: 'var(--radius-full)', background: 'var(--danger)',
            color: '#fff', fontSize: '0.625rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {showPanel && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8,
          width: 360, maxHeight: 480, background: 'var(--bg-white)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)', overflow: 'hidden',
          zIndex: 9000, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Notifications</span>
            <button onClick={() => setShowPanel(false)} style={{
              width: 24, height: 24, borderRadius: 'var(--radius-full)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '1rem',
            }}>&times;</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>No notifications</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((n, i) => (
                <div key={n.id || i} style={{
                  display: 'flex', gap: 12, padding: 'var(--space-md) var(--space-lg)',
                  borderBottom: '1px solid var(--border-light)',
                  background: n.read ? 'transparent' : 'var(--primary-light)',
                  cursor: 'pointer', transition: 'background var(--transition-fast)',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-full)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: {
                      order: 'var(--primary-light)', vendor: 'var(--info-light)',
                      price: 'var(--warning-light)', deal: 'var(--success-light)',
                      system: 'var(--bg-gray)',
                    }[n.type] || 'var(--bg-gray)',
                    color: {
                      order: 'var(--primary)', vendor: 'var(--info)',
                      price: 'var(--warning)', deal: 'var(--success)',
                      system: 'var(--text-secondary)',
                    }[n.type] || 'var(--text-secondary)',
                    flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {n.type === 'order' && <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />}
                      {n.type === 'vendor' && <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />}
                      {n.type === 'price' && <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />}
                      {n.type === 'deal' && <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />}
                      {(!n.type || n.type === 'system') && <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />}
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0, fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>{n.message}</p>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>
                      {n.timestamp ? new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4 }} />}
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div style={{
              padding: 'var(--space-sm) var(--space-lg)', borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <button style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', padding: '6px 0' }}>
                Mark all as read
              </button>
              {onViewAll && (
                <button onClick={onViewAll} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', padding: '6px 0' }}>
                  View all
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
