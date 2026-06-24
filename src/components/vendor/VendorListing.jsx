import { useState, useMemo, useEffect } from 'react'
import api from '../../api'
import VendorCard from './VendorCard'
import FilterPanel from '../search/FilterPanel'
import FilterChips from '../search/FilterChips'
import Icon from '../../components/common/Icons'

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'minOrder', label: 'Min Order: Low to High' },
  { value: 'reviews', label: 'Most Reviews' },
]

export default function VendorListing() {
  const [vendors, setVendors] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [sort, setSort] = useState('rating')
  const [filters, setFilters] = useState({})

  useEffect(() => {
    api.vendors()
      .then(res => setVendors(res.data || []))
      .catch(() => setVendors([]))
  }, [])

  const filtered = useMemo(() => {
    let result = [...vendors]
    if (filters.state) result = result.filter(v => v.state === filters.state)
    if (filters.certifications && filters.certifications.length > 0) {
      result = result.filter(v => filters.certifications.some(c => v.certifications.includes(c)))
    }
    if (filters.rating) result = result.filter(v => v.rating >= Number(filters.rating))
    if (filters.moqMin) result = result.filter(v => v.minOrder >= Number(filters.moqMin))
    if (filters.verified) result = result.filter(v => v.isVerified)

    switch (sort) {
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'minOrder': result.sort((a, b) => a.minOrder - b.minOrder); break
      case 'reviews': result.sort((a, b) => b.reviewCount - a.reviewCount); break
      default: result.sort((a, b) => b.rating - a.rating); break
    }
    return result
  }, [filters, sort])

  const activeFilters = Object.entries(filters).filter(([, v]) => v && (Array.isArray(v) ? v.length > 0 : true))

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: '0 0 260px', minWidth: 0 }} className="desktop-filter">
        <FilterPanel filters={filters} onChange={setFilters} type="vendor" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <strong>{filtered.length}</strong> vendor{filtered.length !== 1 ? 's' : ''} found
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button onClick={() => setViewMode('grid')} style={{
                padding: '6px 10px', border: 'none', background: viewMode === 'grid' ? 'var(--primary-light)' : 'transparent',
                cursor: 'pointer', display: 'flex', color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
              }} aria-label="Grid view">
                <Icon name="gridView" size={16} />
              </button>
              <button onClick={() => setViewMode('list')} style={{
                padding: '6px 10px', border: 'none', borderLeft: '1px solid var(--border)', background: viewMode === 'list' ? 'var(--primary-light)' : 'transparent',
                cursor: 'pointer', display: 'flex', color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
              }} aria-label="List view">
                <Icon name="list" size={16} />
              </button>
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
              padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-white)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)',
              cursor: 'pointer', outline: 'none',
            }}>
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        {activeFilters.length > 0 && <FilterChips filters={filters} onChange={setFilters} />}

        <div className="vendor-grid" style={{
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: 'repeat(3, 1fr)',
          flexDirection: viewMode === 'list' ? 'column' : undefined,
          gap: 16,
        }}>
          {filtered.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><Icon name="faIndustry" size={24} /></div>
            <div className="empty-state-title">No vendors found</div>
            <div className="empty-state-text">Try adjusting your filters</div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .desktop-filter { flex-basis: 220px !important; }
        }
        @media (max-width: 768px) {
          .desktop-filter { display: none; }
          .vendor-grid { grid-template-columns: repeat(2, 1fr) !important; }
          [class*="VendorListing"] > div:first-child { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .vendor-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
