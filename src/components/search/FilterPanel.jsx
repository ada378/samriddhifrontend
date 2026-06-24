import { useState, useEffect } from 'react'
import api from '../../api'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'

const COLLAPSIBLE_SX = { fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }
const certifications = ['FSSAI', 'ISO', 'BIS', 'Organic', 'GMP', 'HACCP']
const deliveryOptions = ['1-2 days', '2-4 days', '3-5 days', '4-7 days', '5-8 days']

function CollapsibleSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 12, marginBottom: 12 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: 'none', background: 'none', cursor: 'pointer', padding: 0, marginBottom: open ? 8 : 0,
        }}
      >
        <h5 style={COLLAPSIBLE_SX}>{title}</h5>
        <Icon name="chevronDown" size={14}
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>
      {open && children}
    </div>
  )
}

export default function FilterPanel({ filters = {}, onChange, type = 'product' }) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [showMobile, setShowMobile] = useState(false)
  const [categories, setCategories] = useState([])
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    Promise.all([
      api.categories(),
      api.vendors()
    ]).then(([catRes, venRes]) => {
      setCategories(catRes.data || [])
      setVendors(venRes.data || [])
    }).catch(() => {
      setCategories([])
      setVendors([])
    })
  }, [])

  const states = [...new Set(vendors.map(v => v.state))].sort()

  const updateFilter = (key, value) => {
    const updated = { ...localFilters, [key]: value }
    if (!value || (Array.isArray(value) && value.length === 0)) delete updated[key]
    setLocalFilters(updated)
  }

  const handleApply = () => {
    onChange(localFilters)
    setShowMobile(false)
  }

  const handleClear = () => {
    setLocalFilters({})
    onChange({})
  }

  const toggleArray = (key, item) => {
    const current = localFilters[key] || []
    const updated = current.includes(item) ? current.filter(x => x !== item) : [...current, item]
    updateFilter(key, updated.length > 0 ? updated : null)
  }

  const panelContent = (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ fontSize: '0.9375rem', margin: 0 }}>Filters</h4>
        <button onClick={handleClear} style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Clear All
        </button>
      </div>

      {type === 'product' && (
        <CollapsibleSection title="Category">
          {categories.map(cat => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer', fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                checked={(localFilters.categories || []).includes(cat.slug)}
                onChange={() => toggleArray('categories', cat.slug)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>{cat.icon} {cat.name}</span>
            </label>
          ))}
        </CollapsibleSection>
      )}

      <CollapsibleSection title="Price Range" defaultOpen={false}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Min"
            value={localFilters.priceMin || ''}
            onChange={(e) => updateFilter('priceMin', e.target.value || null)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', outline: 'none' }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>—</span>
          <input
            type="number"
            placeholder="Max"
            value={localFilters.priceMax || ''}
            onChange={(e) => updateFilter('priceMax', e.target.value || null)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', outline: 'none' }}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Rating">
        {[4, 3, 2, 1].map(r => (
          <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', cursor: 'pointer', fontSize: '0.8125rem' }}>
            <input
              type="checkbox"
              checked={(localFilters.rating || 0) === r}
              onChange={() => updateFilter('rating', localFilters.rating === r ? null : r)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span style={{ color: 'var(--accent)' }}>{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
            <span style={{ color: 'var(--text-muted)' }}>& up</span>
          </label>
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="State" defaultOpen={false}>
        <select
          value={localFilters.state || ''}
          onChange={(e) => updateFilter('state', e.target.value || null)}
          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', outline: 'none', background: 'var(--bg-white)' }}
        >
          <option value="">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </CollapsibleSection>

      {type === 'vendor' && (
        <CollapsibleSection title="Certifications">
          {certifications.map(cert => (
            <label key={cert} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', cursor: 'pointer', fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                checked={(localFilters.certifications || []).includes(cert)}
                onChange={() => toggleArray('certifications', cert)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>{cert}</span>
            </label>
          ))}
        </CollapsibleSection>
      )}

      <CollapsibleSection title="MOQ" defaultOpen={false}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Min MOQ"
            value={localFilters.moqMin || ''}
            onChange={(e) => updateFilter('moqMin', e.target.value || null)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', outline: 'none' }}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Delivery Time" defaultOpen={false}>
        <select
          value={localFilters.delivery || ''}
          onChange={(e) => updateFilter('delivery', e.target.value || null)}
          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', outline: 'none', background: 'var(--bg-white)' }}
        >
          <option value="">Any</option>
          {deliveryOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </CollapsibleSection>

      <Button size="sm" block onClick={handleApply} style={{ marginTop: 8 }}>
        Apply Filters
      </Button>
    </div>
  )

  return (
    <>
      <div className="desktop-filter-panel">{panelContent}</div>

      <div className="mobile-filter-trigger" style={{ position: 'relative' }}>
        <button
          onClick={() => setShowMobile(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-white)', cursor: 'pointer', fontSize: '0.8125rem',
            fontWeight: 500, color: 'var(--text-secondary)',
          }}
        >
          <Icon name="sliders" size={14} />
          {' '}Filters
        </button>
      </div>

      {showMobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column',
          background: 'var(--bg-white)', animation: 'modal-slide-up 0.25s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '1rem', margin: 0 }}>Filters</h4>
            <button onClick={() => setShowMobile(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
              <Icon name="close" size={20} />
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>{panelContent}</div>
          <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
            <Button size="lg" block onClick={handleApply}>Show Results</Button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-filter-panel { display: none; }
          .mobile-filter-trigger { display: inline-flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-filter-trigger { display: none !important; }
        }
      `}</style>
    </>
  )
}
