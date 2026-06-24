import { useState } from 'react'
import Icon from '../components/common/Icons'
import Button from '../components/common/Button'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const fieldStyle = {
    width: '100%', padding: '10px 14px', border: '2px solid var(--border)',
    borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.875rem',
    transition: 'border-color 0.15s',
  }

  const contactInfo = [
    { icon: 'phone', label: 'Phone', value: '+91 1800-123-4567' },
    { icon: 'mail', label: 'Email', value: 'support@samriddhi.in' },
    { icon: 'home', label: 'Office', value: 'B-42, Sector 62, Noida, Uttar Pradesh 201309' },
    { icon: 'clock', label: 'Hours', value: 'Mon-Sat, 9:00 AM - 6:00 PM' },
  ]

  return (
    <div className="container" style={{ maxWidth: 900, padding: 'var(--space-4xl) 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Contact Us</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
          Have a question, feedback, or need assistance? We're here to help.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="contact-grid">
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
            {contactInfo.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-light)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name={item.icon} size={20} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-xl)', textAlign: 'center',
          }}>
            <Icon name="headset" size={32} color="var(--primary)" />
            <h4 style={{ margin: '8px 0 4px' }}>Need instant help?</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              Our support team is available 24/7
            </p>
            <Button variant="secondary" onClick={() => window.location.href = '/support'}>
              Visit Support Center
            </Button>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} style={{
            background: 'var(--bg-white)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)',
          }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)' }}>Send us a message</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Name *</label>
                <input style={fieldStyle} value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required placeholder="Your full name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Email *</label>
                <input style={fieldStyle} type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} required placeholder="your@email.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Phone</label>
                <input style={fieldStyle} value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="+91 98765 43210" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Subject *</label>
                <input style={fieldStyle} value={form.subject} onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))} required placeholder="How can we help?" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Message *</label>
                <textarea style={{ ...fieldStyle, minHeight: 120, resize: 'vertical' }} value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} required placeholder="Tell us more about your query..." />
              </div>
            </div>

            <Button type="submit" style={{ marginTop: 'var(--space-lg)', width: '100%' }}>
              {sent ? '✓ Message Sent!' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
