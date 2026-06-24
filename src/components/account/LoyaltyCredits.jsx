import { useState, useMemo } from 'react'
import Card from '../common/Card'

const EARN_RATE = 5
const INITIAL_BALANCE = 1250
const EXPIRY = '30 Jun 2026'

const historyData = [
  { id: 1, date: '2026-06-05', description: 'Order ORD10003', earned: 110, burned: 0, balance: 1250 },
  { id: 2, date: '2026-06-01', description: 'Order ORD10002', earned: 45, burned: 0, balance: 1140 },
  { id: 3, date: '2026-05-28', description: 'Redeemed at checkout', earned: 0, burned: 200, balance: 1095 },
  { id: 4, date: '2026-05-25', description: 'Order ORD10005', earned: 25, burned: 0, balance: 1295 },
  { id: 5, date: '2026-05-22', description: 'Signup Bonus', earned: 500, burned: 0, balance: 1270 },
  { id: 6, date: '2026-05-20', description: 'Referral - Ananya Gupta', earned: 100, burned: 0, balance: 770 },
  { id: 7, date: '2026-05-15', description: 'Order ORD10001', earned: 36, burned: 0, balance: 670 },
  { id: 8, date: '2026-05-10', description: 'Redeemed at checkout', earned: 0, burned: 150, balance: 634 },
]

export default function LoyaltyCredits() {
  const [balance] = useState(INITIAL_BALANCE)

  const totals = useMemo(() => {
    let earned = 0, burned = 0
    historyData.forEach(h => { earned += h.earned; burned += h.burned })
    return { earned, burned }
  }, [])

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v12M8 10h6a2 2 0 0 1 0 4H8" />
          </svg>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 4 }}>NamakCoins Balance</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>{balance.toLocaleString()}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          🕐 Expires on {EXPIRY} · {EARN_RATE} coins per ₹100 spent
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
        <Card padding="var(--space-lg)" hover={false}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Total Earned</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>+{totals.earned.toLocaleString()}</div>
        </Card>
        <Card padding="var(--space-lg)" hover={false}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Total Redeemed</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>-{totals.burned.toLocaleString()}</div>
        </Card>
      </div>

      <Card padding="var(--space-xl)" hover={false}>
        <h5 style={{ marginBottom: 'var(--space-lg)' }}>Transaction History</h5>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Description</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Earned</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Burned</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map(h => (
                <tr key={h.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>
                    {new Date(h.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td style={{ padding: '8px 12px' }}>{h.description}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: h.earned > 0 ? 'var(--success)' : 'inherit', fontWeight: h.earned > 0 ? 600 : 400 }}>
                    {h.earned > 0 ? `+${h.earned}` : '-'}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: h.burned > 0 ? 'var(--danger)' : 'inherit', fontWeight: h.burned > 0 ? 600 : 400 }}>
                    {h.burned > 0 ? `-${h.burned}` : '-'}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>{h.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card padding="var(--space-xl)" style={{ marginTop: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M8 10h6a2 2 0 0 1 0 4H8" /></svg>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Redeem at Checkout</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Use your NamakCoins to get discounts on your next order. 100 coins = ₹1 off.
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
