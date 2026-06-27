import { useNavigate } from 'react-router-dom'
import Icon from '../common/Icons'

const values = [
  {
    icon: 'shield',
    label: 'Quality Assurance',
    desc: 'All products are FSSAI certified and tested for purity. We ensure every batch meets the highest quality standards.',
    color: '#2e6a40',
  },
  {
    icon: 'award',
    label: 'Trusted Sourcing',
    desc: 'We partner directly with verified manufacturers across India, ensuring complete transparency and fair pricing.',
    color: '#d4ac69',
  },
  {
    icon: 'truck',
    label: 'Pan India Delivery',
    desc: 'Reliable logistics network covering all states. From small orders to bulk shipments, we deliver on time.',
    color: '#1e4d2b',
  },
  {
    icon: 'leaf',
    label: 'Sustainable Practices',
    desc: 'Committed to eco-friendly packaging and supporting traditional salt farming communities across India.',
    color: '#3d8b4f',
  },
]

export default function OurValues() {
  const navigate = useNavigate()

  return (
    <section className="values-section">
      <div className="container">
        <h2 className="section-title">Our Values</h2>
        <p className="values-subtitle">
          What makes Samriddhi the preferred salt marketplace in India
        </p>
        <div className="values-grid">
          {values.map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-icon-wrap" style={{ background: `${v.color}15` }}>
                <Icon name={v.icon} size={28} color={v.color} />
              </div>
              <h3 className="value-title">{v.label}</h3>
              <p className="value-desc">{v.desc}</p>
              <button onClick={() => navigate('/about')} className="value-read-more">
                Read More <Icon name="arrowRight" size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .values-section {
          padding: var(--space-5xl) 0;
          background: var(--bg-gray);
        }
        .values-subtitle {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9375rem;
          margin-top: -20px;
          margin-bottom: 40px;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .value-card {
          background: var(--bg-white);
          border-radius: var(--radius-lg);
          padding: 32px 24px;
          text-align: center;
          border: 1px solid var(--border);
          transition: all var(--transition-base);
        }
        .value-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
          border-color: var(--primary-light);
        }
        .value-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .value-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: var(--text-primary);
        }
        .value-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .value-read-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: gap var(--transition-fast);
          font-family: var(--font-sans);
        }
        .value-read-more:hover {
          gap: 10px;
          color: var(--primary-dark);
        }

        @media (max-width: 1024px) {
          .values-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
        @media (max-width: 768px) {
          .values-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .value-card { padding: 24px 16px; }
          .value-title { font-size: 1rem; }
          .value-desc { font-size: 0.8125rem; }
        }
        @media (max-width: 480px) {
          .values-grid { grid-template-columns: 1fr; gap: 16px; }
          .values-subtitle { font-size: 0.85rem; padding: 0 12px; }
        }
      `}</style>
    </section>
  )
}
