import Icon from '../../components/common/Icons'

export default function FilterChips({ filters = {}, onChange }) {
  const chips = []

  if (filters.categories) {
    filters.categories.forEach(cat => chips.push({ key: 'categories', label: cat, value: cat }))
  }
  if (filters.state) chips.push({ key: 'state', label: `State: ${filters.state}`, value: filters.state })
  if (filters.rating) chips.push({ key: 'rating', label: `${filters.rating}★ & up`, value: filters.rating })
  if (filters.priceMin) chips.push({ key: 'priceMin', label: `Min ₹${filters.priceMin}`, value: filters.priceMin })
  if (filters.priceMax) chips.push({ key: 'priceMax', label: `Max ₹${filters.priceMax}`, value: filters.priceMax })
  if (filters.moqMin) chips.push({ key: 'moqMin', label: `MOQ ${filters.moqMin}+`, value: filters.moqMin })
  if (filters.delivery) chips.push({ key: 'delivery', label: `Delivery: ${filters.delivery}`, value: filters.delivery })

  if (filters.certifications) {
    filters.certifications.forEach(c => chips.push({ key: 'certifications', label: c, value: c }))
  }

  const removeChip = (chip) => {
    const updated = { ...filters }
    if (Array.isArray(filters[chip.key])) {
      const arr = filters[chip.key].filter(v => v !== chip.value)
      if (arr.length === 0) delete updated[chip.key]
      else updated[chip.key] = arr
    } else {
      delete updated[chip.key]
    }
    onChange(updated)
  }

  const clearAll = () => onChange({})

  if (chips.length === 0) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12, alignItems: 'center' }}>
      {chips.map((chip, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 8px 4px 12px',
            background: 'var(--primary-light)', color: 'var(--primary)',
            borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 500,
            animation: 'fade-in 0.2s ease',
          }}
        >
          {chip.label}
          <button
            onClick={() => removeChip(chip)}
            style={{
              border: 'none', background: 'none', cursor: 'pointer', padding: 0,
              display: 'inline-flex', color: 'var(--primary)', lineHeight: 0,
            }}
            aria-label={`Remove ${chip.label}`}
          >
            <Icon name="close" size={12} />
          </button>
        </span>
      ))}
      <button
        onClick={clearAll}
        style={{
          border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.75rem',
          color: 'var(--text-muted)', fontWeight: 500, padding: '4px 8px',
        }}
      >
        Clear all
      </button>
    </div>
  )
}
