import Icon from '../common/Icons'

const badges = [
  { label: 'FSSAI Certified', color: '#2e6a40' },
  { label: 'ISO 22000', color: '#d4ac69' },
  { label: 'GMP Certified', color: '#1e4d2b' },
  { label: 'HACCP Certified', color: '#3d8b4f' },
  { label: 'India Organic', color: '#c49a52' },
]

export default function TrustSignals() {
  return (
    <section className="cert-section">
      <div className="container">
        <h2 className="section-title">Our Certifications</h2>
        <p className="cert-subtitle">
          We maintain the highest standards of quality and safety
        </p>
        <div className="cert-grid">
          {badges.map((item, i) => (
            <div key={i} className="cert-item">
              <div className="cert-icon">
                <Icon name="checkCircle" size={24} color={item.color} />
              </div>
              <span className="cert-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .cert-section {
          padding: var(--space-5xl) 0;
          background: var(--bg-white);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .cert-subtitle {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9375rem;
          margin-top: -20px;
          margin-bottom: 40px;
        }
        .cert-grid {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .cert-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: var(--bg-gray);
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
        }
        .cert-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-heading);
        }

        @media (max-width: 768px) {
          .cert-grid { gap: 16px; }
          .cert-item { padding: 8px 16px; }
          .cert-label { font-size: 0.8125rem; }
        }
        @media (max-width: 480px) {
          .cert-grid { gap: 12px; }
          .cert-item { padding: 6px 14px; }
          .cert-label { font-size: 0.75rem; }
        }
      `}</style>
    </section>
  )
}
