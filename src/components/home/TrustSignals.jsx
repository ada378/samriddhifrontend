import Icon from '../common/Icons'

const badges = [
  { icon: <Icon name="check" size={20} color="var(--success)" />, label: 'FSSAI Certified', color: '#1D9E75' },
  { icon: <Icon name="shield" size={20} color="var(--info)" />, label: 'ISO Verified', color: '#534AB7' },
  { icon: <Icon name="award" size={20} color="var(--accent)" />, label: '100% Pure', color: '#CC0C2C' },
  { icon: <Icon name="lock" size={20} color="var(--primary)" />, label: 'Secure Payments', color: '#1A1A2E' },
  { icon: <Icon name="truck" size={20} color="var(--secondary)" />, label: 'Pan India Delivery', color: '#E8B830' },
]

export default function TrustSignals() {
  return (
    <section style={{ background: 'var(--bg-gray)', padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
        }}>
          {badges.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '8px 12px',
            }}>
              {item.icon}
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 375px) {
          .container > div { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
