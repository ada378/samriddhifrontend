import { useState, useMemo, useEffect } from 'react'
import api from '../../api'
import ProductCard from './ProductCard'
import FilterPanel from '../search/FilterPanel'
import FilterChips from '../search/FilterChips'
import Icon from '../../components/common/Icons'

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Rating' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
]

const ITEMS_PER_PAGE = 12

export default function ProductListing({ category, vendorId }) {
  const [products, setProducts] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [sort, setSort] = useState('relevance')
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  useEffect(() => {
    api.products()
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
  }, [])

  const filtered = useMemo(() => {
    let result = [...products]

    if (category) result = result.filter(p => p.category === category)
    if (vendorId) result = result.filter(p => p.vendorId === vendorId)
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category))
    }
    if (filters.priceMin) result = result.filter(p => p.price >= Number(filters.priceMin))
    if (filters.priceMax) result = result.filter(p => p.price <= Number(filters.priceMax))
    if (filters.rating) result = result.filter(p => p.ratings >= Number(filters.rating))
    if (filters.moqMin) result = result.filter(p => p.moq >= Number(filters.moqMin))

    switch (sort) {
      case 'rating': result.sort((a, b) => b.ratings - a.ratings); break
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'newest': result.sort((a, b) => (b.id > a.id ? 1 : -1)); break
      default: break
    }
    return result
  }, [category, vendorId, filters, sort])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE)

  const activeFilters = Object.entries(filters).filter(([, v]) => v && (Array.isArray(v) ? v.length > 0 : true))

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: '0 0 260px', minWidth: 0 }} className="desktop-filter">
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>
      <button className="mobile-filter-toggle btn btn-secondary btn-sm" onClick={() => setShowMobileFilter(true)}
        style={{ display: 'none', alignItems: 'center', gap: 6 }}>
        <Icon name="filter" size={16} /> Filters
      </button>
      {showMobileFilter && (
        <div className="mobile-filter-overlay" onClick={() => setShowMobileFilter(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, background: 'var(--bg-white)', padding: 24, overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ margin: 0 }}>Filters</h4>
              <button onClick={() => setShowMobileFilter(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                <Icon name="close" size={20} />
              </button>
            </div>
            <FilterPanel filters={filters} onChange={(f) => { setFilters(f); setShowMobileFilter(false) }} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''} found
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 10px', border: 'none', background: viewMode === 'grid' ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer', display: 'flex', color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                }}
                aria-label="Grid view"
              >
                <Icon name="gridView" size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 10px', border: 'none', borderLeft: '1px solid var(--border)', background: viewMode === 'list' ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer', display: 'flex', color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                }}
                aria-label="List view"
              >
                <Icon name="list" size={16} />
              </button>
            </div>

            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1) }}
              style={{
                padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-white)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)',
                cursor: 'pointer', outline: 'none',
              }}
            >
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <FilterChips filters={filters} onChange={setFilters} />
        )}

        <div className="product-grid" style={{
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: 'repeat(3, 1fr)',
          flexDirection: viewMode === 'list' ? 'column' : undefined,
          gap: 16,
        }}>
          {paginated.map(product => (
            <ProductCard key={product.id} product={product} view={viewMode} />
          ))}
        </div>

        {paginated.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><Icon name="mdSalt" size={24} /></div>
            <div className="empty-state-title">No products found</div>
            <div className="empty-state-text">Try adjusting your filters or search query</div>
          </div>
        )}

        {totalPages > page && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button
              onClick={() => setPage(p => p + 1)}
              className="btn btn-secondary"
            >
              Load More ({filtered.length - paginated.length} remaining)
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .container > div > div:first-child { flex-basis: 220px !important; }
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .desktop-filter { display: none; }
          .mobile-filter-toggle { display: inline-flex !important; }
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
        @media (max-width: 480px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .container > div { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}
