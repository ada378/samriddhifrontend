import { Link } from 'react-router-dom'
import Icon from '../components/common/Icons'

const stats = [
  { value: '500+', label: 'Salt Varieties' },
  { value: '50+', label: 'Trusted Vendors' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '28', label: 'States Served' },
]

const timeline = [
  { year: '2020', title: 'The Idea', desc: 'Founded with a vision to connect India\'s finest salt producers directly with buyers.' },
  { year: '2021', title: 'Platform Launch', desc: 'Launched our multi-vendor marketplace with 15 vendors and 100+ salt products.' },
  { year: '2022', title: 'Pan-India Expansion', desc: 'Expanded operations to cover all 28 states with regional fulfillment centers.' },
  { year: '2023', title: '1 Million Orders', desc: 'Crossed 1 million orders with 99.2% on-time delivery rate.' },
  { year: '2024', title: 'AI-Powered Platform', desc: 'Introduced AI-driven quality scoring, dynamic pricing, and smart logistics.' },
]

export default function AboutPage() {
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #0d9488 100%)',
        color: 'white', padding: 'var(--space-5xl) 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>About Samriddhi</h1>
          <p style={{ fontSize: '1.0625rem', opacity: 0.9, maxWidth: 600, margin: '0 auto' }}>
            India's premier multi-vendor marketplace dedicated to authentic, high-quality salts from across the nation.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-4xl) 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 'var(--space-4xl)' }} className="about-grid">
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Our Mission</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
              At Samriddhi, we believe that salt is more than just a seasoning — it's a cornerstone of health, culture, and industry. Our mission is to bridge the gap between India's traditional salt producers and modern consumers.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              We empower local artisans, small-scale miners, and regional producers by giving them a direct digital storefront, while offering buyers unmatched variety, quality assurance, and competitive pricing.
            </p>
          </div>
          <div style={{
            background: 'var(--bg-gray)', borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-2xl)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>Our Journey</h2>
        <div style={{ position: 'relative', paddingLeft: 40 }}>
          <div style={{
            position: 'absolute', left: 15, top: 0, bottom: 0, width: 2,
            background: 'var(--border)',
          }} />
          {timeline.map((item, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 32, paddingLeft: 24 }}>
              <div style={{
                position: 'absolute', left: -33, top: 4, width: 12, height: 12,
                borderRadius: '50%', background: 'var(--primary)', border: '3px solid var(--bg-white)',
                boxShadow: '0 0 0 2px var(--primary)',
              }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 700 }}>{item.year}</span>
              <h4 style={{ margin: '4px 0' }}>{item.title}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-4xl)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Ready to explore?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
            Browse thousands of salt products from India's best producers.
          </p>
          <Link to="/products" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Start Shopping <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
