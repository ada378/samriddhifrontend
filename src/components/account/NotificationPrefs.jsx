import { useState } from 'react'
import Button from '../common/Button'
import { useApp } from '../../context/AppContext'

const NOTIFICATION_TYPES = [
  { id: 'order_updates', label: 'Order Updates', desc: 'Get notified about order confirmation, shipping, and delivery status changes', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
  { id: 'price_alerts', label: 'Price Alerts', desc: 'Receive alerts when products on your wishlist drop in price', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { id: 'new_vendor', label: 'New Vendor in Area', desc: 'Get notified when a new salt vendor starts serving your pincode', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
  { id: 'promotional', label: 'Promotional Emails', desc: 'Receive offers, seasonal sales, and deals from Samriddhi and partners', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
  { id: 'sms', label: 'SMS Alerts', desc: 'Get SMS notifications for critical order updates and OTP verifications', icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' },
  { id: 'whatsapp', label: 'WhatsApp Updates', desc: 'Get order updates and promotional content on WhatsApp', icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' },
]

export default function NotificationPrefs() {
  const { showToast } = useApp()
  const [prefs, setPrefs] = useState({
    order_updates: true,
    price_alerts: true,
    new_vendor: false,
    promotional: true,
    sms: true,
    whatsapp: false,
  })

  const toggle = (id) => {
    setPrefs(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSave = () => {
    showToast('Notification preferences saved!', 'success')
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 600, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 'var(--space-2xl)' }}>Notification Preferences</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NOTIFICATION_TYPES.map(nt => (
          <div key={nt.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: 'var(--space-lg)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-white)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: prefs[nt.id] ? 'var(--primary-light)' : 'var(--bg-gray)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={prefs[nt.id] ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round">
                <path d={nt.icon} />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: 2 }}>{nt.label}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{nt.desc}</div>
            </div>
            <div onClick={() => toggle(nt.id)} style={{
              width: 44, height: 24, borderRadius: 12, position: 'relative', flexShrink: 0,
              background: prefs[nt.id] ? 'var(--primary)' : 'var(--border)',
              cursor: 'pointer', transition: 'background 0.2s',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 2, transition: 'left 0.2s',
                left: prefs[nt.id] ? 22 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </div>
          </div>
        ))}
      </div>

      <Button block size="lg" style={{ marginTop: 'var(--space-2xl)' }} onClick={handleSave}>Save Preferences</Button>
    </div>
  )
}
