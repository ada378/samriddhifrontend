import { useState } from 'react'

const tiers = [
  { label: '1-10 bags', range: [1, 10], discount: 0 },
  { label: '10-50 bags', range: [10, 50], discount: 5 },
  { label: '50-100 bags', range: [50, 100], discount: 10 },
  { label: '100+ bags', range: [100, Infinity], discount: 15 },
]

export default function PricingMatrix({ basePrice, unit }) {
  const [selected, setSelected] = useState(0)

  return (
    <div>
      <h4 style={{ fontSize: '1rem', marginBottom: 12 }}>Tiered Pricing</h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
      }}>
        {tiers.map((tier, i) => {
          const price = basePrice * (1 - tier.discount / 100)
          const isActive = i === selected
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                padding: 12,
                border: `2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--primary-light)' : 'var(--bg-white)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isActive ? 'var(--primary)' : 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                {tier.label}
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: isActive ? 'var(--primary)' : 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{price.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>/{unit}</span>
              {tier.discount > 0 && (
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--success)', display: 'block', marginTop: 4 }}>
                  Save {tier.discount}%
                </span>
              )}
            </button>
          )
        })}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
        * Prices are per {unit}. GST extra.
      </p>

      <style>{`
        @media (max-width: 375px) {
          .container > div:first-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
