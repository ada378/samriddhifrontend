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
        <div className="trust-grid">
          {badges.map((item, i) => (
            <div key={i} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              <span className="trust-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 6px 8px;
        }
        .trust-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .trust-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .trust-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
          .trust-item { gap: 6px !important; padding: 4px 6px !important; }
          .trust-label { font-size: 0.75rem !important; }
        }
        @media (max-width: 480px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
          .trust-item { flex-direction: column !important; gap: 4px !important; padding: 8px 4px !important; text-align: center !important; }
          .trust-label { font-size: 0.6875rem !important; white-space: normal !important; word-break: break-word !important; }
        }
        @media (max-width: 360px) {
          .trust-grid { grid-template-columns: 1fr 1fr !important; gap: 4px !important; }
          .trust-item { padding: 6px 2px !important; }
          .trust-label { font-size: 0.625rem !important; }
        }
      `}</style>
    </section>
  )
}
