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
    <section className="newsletter-section">
      <div className="container newsletter-content">
        <h2 className="newsletter-title">Get Wholesale Rate Alerts</h2>
        <p className="newsletter-text">
          Subscribe to receive daily price updates, bulk deal notifications, and new vendor alerts.
        </p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="newsletter-input"
          />
          <Button type="submit" className="newsletter-submit">
            Subscribe
          </Button>
        </form>
        <p className="newsletter-disclaimer">
          No spam. Unsubscribe anytime.
        </p>
      </div>
      <style>{`
        .newsletter-section {
          background: linear-gradient(135deg, #2e6a40 0%, #1e4d2b 100%);
          padding: 56px 0;
        }
        .newsletter-content {
          text-align: center;
        }
        .newsletter-title {
          color: #fff;
          font-size: clamp(1.25rem, 3vw, 1.75rem);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .newsletter-text {
          color: rgba(255,255,255,0.8);
          font-size: 0.9375rem;
          margin-bottom: 24px;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }
        .newsletter-form {
          display: flex;
          gap: 0;
          max-width: 440px;
          margin: 0 auto;
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .newsletter-input {
          flex: 1;
          padding: 12px 16px;
          border: none;
          outline: none;
          font-size: 0.9375rem;
          background: #fff;
          color: var(--text-primary);
          min-width: 0;
        }
        .newsletter-submit {
          border-radius: 0 !important;
          padding: 12px 24px !important;
          background: var(--accent) !important;
          color: var(--text-primary) !important;
          font-weight: 700 !important;
          white-space: nowrap !important;
          border: none !important;
        }
        .newsletter-submit:hover {
          background: #c49a52 !important;
        }
        .newsletter-disclaimer {
          color: rgba(255,255,255,0.5);
          font-size: 0.75rem;
          margin-top: 12px;
        }

        @media (max-width: 480px) {
          .newsletter-section { padding: 40px 0 !important; }
          .newsletter-form { flex-direction: column !important; gap: 8px !important; border-radius: var(--radius-md) !important; }
          .newsletter-input { border-radius: var(--radius-md) !important; width: 100% !important; text-align: center !important; }
          .newsletter-submit { border-radius: var(--radius-md) !important; width: 100% !important; }
        }
      `}</style>
    </section>
  )
}
