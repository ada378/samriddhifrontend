import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'

const REFERRAL_LINK = 'https://samriddhi.app/ref/USER123'
const CREDITS_PER_REFERRAL = 100
const referred = [
  { id: 1, name: 'Ananya Gupta', date: '2026-05-20', earned: 100 },
  { id: 2, name: 'Rohit Sharma', date: '2026-05-25', earned: 100 },
  { id: 3, name: 'Priya Verma', date: '2026-06-02', earned: 100 },
  { id: 4, name: 'Amit Singh', date: '2026-06-08', earned: 100 },
]

export default function ReferralProgram() {
  const { showToast } = useApp()
  const [copied, setCopied] = useState(false)

  const totalEarned = referred.reduce((s, r) => s + r.earned, 0)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(REFERRAL_LINK)
    setCopied(true)
    showToast('Referral link copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWA = () => {
    const text = encodeURIComponent(`🧂 Join Samriddhi - India's premium salt marketplace! Use my referral link: ${REFERRAL_LINK}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Join Samriddhi Marketplace')
    const body = encodeURIComponent(`Hi,\n\nI'm using Samriddhi for buying premium salt products. Join using my referral link:\n\n${REFERRAL_LINK}\n\nEarn NamakCoins on every purchase!\n\n- From your friend`)
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3>Refer & Earn NamakCoins</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Share Samriddhi with your network and earn {CREDITS_PER_REFERRAL} NamakCoins for every friend who signs up!
        </p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)',
        textAlign: 'center', marginBottom: 'var(--space-2xl)',
      }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Your Referral Link</div>
        <div style={{
          display: 'flex', gap: 8, background: 'var(--bg-white)', borderRadius: 'var(--radius-md)',
          padding: '4px', border: '2px solid var(--border)',
        }}>
          <input readOnly value={REFERRAL_LINK} style={{
            flex: 1, padding: '10px 14px', border: 'none', outline: 'none',
            fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', background: 'transparent',
          }} />
          <Button size="sm" onClick={handleCopyLink}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 'var(--space-lg)', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={handleShareWA} icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
          }>Share via WhatsApp</Button>
          <Button variant="secondary" onClick={handleShareEmail} icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          }>Share via Email</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
        <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 4 }}>Friends Referred</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>{referred.length}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 4 }}>Credits Earned</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>{totalEarned}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-xl)' }}>
        <h5 style={{ marginBottom: 'var(--space-lg)' }}>Referral History</h5>
        {referred.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No referrals yet. Share your link to start earning!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {referred.map(r => (
              <div key={r.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--border-light)',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined {new Date(r.date).toLocaleDateString('en-IN')}</div>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--success)', fontSize: '0.875rem' }}>+{r.earned}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 'var(--space-lg)', padding: '14px 16px', background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        <strong>Terms & Conditions:</strong><br />
        • Earn {CREDITS_PER_REFERRAL} NamakCoins for each friend who signs up using your referral link and places their first order.<br />
        • NamakCoins are credited after the referred friend's first order is delivered.<br />
        • No limit on the number of referrals.<br />
        • NamakCoins expire 6 months from the date of credit.<br />
        • Cannot be combined with other referral or bonus offers.<br />
        • Samriddhi reserves the right to modify or cancel this program at any time.
      </div>
    </div>
  )
}
