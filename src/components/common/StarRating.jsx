export default function StarRating({ rating = 0, size = 18, interactive, onChange }) {
  const stars = [1, 2, 3, 4, 5]

  const handleClick = (value) => {
    if (interactive && onChange) onChange(value)
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {stars.map(star => {
        const fill = rating >= star ? '100%' : rating >= star - 0.5 ? '50%' : '0%'
        return (
          <span
            key={star}
            onClick={() => handleClick(star)}
            style={{ cursor: interactive ? 'pointer' : 'default', display: 'inline-flex', lineHeight: 0 }}
          >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={`star-grad-${star}`}>
                  <stop offset={fill} stopColor="var(--accent)" />
                  <stop offset={fill} stopColor="var(--border)" />
                </linearGradient>
              </defs>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={`url(#star-grad-${star})`}
                stroke="var(--accent)"
                strokeWidth="1"
              />
            </svg>
          </span>
        )
      })}
      {rating > 0 && (
        <span style={{ marginLeft: 4, fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  )
}
