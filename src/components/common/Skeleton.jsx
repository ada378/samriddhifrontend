export default function Skeleton({ type = 'text', count = 1, width, height }) {
  const baseStyle = { background: 'linear-gradient(90deg, var(--border-light) 25%, var(--border) 50%, var(--border-light) 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.5s ease-in-out infinite', borderRadius: 'var(--radius-sm)' }

  const types = {
    text: { height: height || 14, width: width || '100%', marginBottom: 8 },
    image: { height: height || 200, width: width || '100%', borderRadius: 'var(--radius-md)' },
    card: { height: height || 320, width: width || '100%', borderRadius: 'var(--radius-lg)', padding: 16 },
    table: { height: height || 40, width: width || '100%', marginBottom: 4 },
  }

  const style = types[type] || types.text

  return (
    <span style={{ display: 'inline-block' }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ display: 'block', ...baseStyle, ...style, width: width || style.width }} />
      ))}
    </span>
  )
}
