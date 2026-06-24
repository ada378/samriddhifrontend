export default function SpecsTable({ specs }) {
  if (!specs || Object.keys(specs).length === 0) return null

  return (
    <div>
      <h4 style={{ fontSize: '1rem', marginBottom: 12 }}>Specifications</h4>
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {Object.entries(specs).map(([key, value], i) => (
          <div
            key={key}
            style={{
              display: 'flex',
              borderBottom: i < Object.keys(specs).length - 1 ? '1px solid var(--border)' : 'none',
              fontSize: '0.875rem',
            }}
          >
            <span style={{
              flex: '0 0 160px',
              padding: '10px 16px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              background: 'var(--bg-gray)',
              borderRight: '1px solid var(--border)',
            }}>
              {key}
            </span>
            <span style={{ padding: '10px 16px', flex: 1, color: 'var(--text-primary)' }}>{value}</span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 375px) {
          div > div > span:first-child { flex-basis: 120px !important; font-size: 0.8125rem !important; }
        }
      `}</style>
    </div>
  )
}
