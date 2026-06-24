import { useState } from 'react'
import Button from '../common/Button'
import { useApp } from '../../context/AppContext'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { showToast } = useApp()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    showToast('Subscribed successfully!', 'success')
    setEmail('')
  }

  return (
    <section style={{ background: 'linear-gradient(135deg, #CC0C2C 0%, #A80923 100%)', padding: '48px 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 700, marginBottom: 8 }}>
          Get Wholesale Rate Alerts
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9375rem', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
          Subscribe to receive daily price updates, bulk deal notifications, and new vendor alerts.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 0, maxWidth: 440, margin: '0 auto', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              outline: 'none',
              fontSize: '0.9375rem',
              background: '#fff',
              color: 'var(--text-primary)',
              minWidth: 0,
            }}
          />
          <Button type="submit" style={{ borderRadius: 0, padding: '12px 24px', background: 'var(--accent)', color: 'var(--text-primary)', fontWeight: 700, whiteSpace: 'nowrap', border: 'none' }}>
            Subscribe
          </Button>
        </form>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: 12 }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
      <style>{`
        @media (max-width: 480px) {
          section form { flex-direction: column !important; gap: 8px !important; border-radius: var(--radius-md) !important; }
          section form input { border-radius: var(--radius-md) !important; width: 100% !important; text-align: center !important; }
          section form button { border-radius: var(--radius-md) !important; width: 100% !important; }
          section { padding: 32px 0 !important; }
        }
      `}</style>
    </section>
  )
}
