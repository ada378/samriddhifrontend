import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import Button from '../common/Button'

export default function SavedVendors() {
  const [allVendors, setAllVendors] = useState([])
  const [products, setProducts] = useState([])
  const [vendorsList, setVendorsList] = useState([])
  const [newProductIndicators, setNewProductIndicators] = useState({})

  useEffect(() => {
    Promise.all([
      api.vendors(),
      api.products()
    ]).then(([venRes, prodRes]) => {
      const vend = venRes.data || []
      setAllVendors(vend)
      setProducts(prodRes.data || [])
      setVendorsList(vend.slice(0, 6).map(v => ({
        ...v,
        followed: true,
        notifNewProducts: true,
        notifDeals: false,
      })))
    }).catch(() => {
      setAllVendors([])
      setProducts([])
      setVendorsList([])
    })
  }, [])

  const vendorProductCounts = useMemo(() => {
    const counts = {}
    products.forEach(p => {
      counts[p.vendorId] = (counts[p.vendorId] || 0) + 1
    })
    return counts
  }, [])

  const handleToggleFollow = (id) => {
    setVendorsList(prev => prev.map(v => v.id === id ? { ...v, followed: !v.followed } : v))
  }

  const handleToggleNotif = (id, field) => {
    setVendorsList(prev => prev.map(v => v.id === id ? { ...v, [field]: !v[field] } : v))
  }

  const followed = vendorsList.filter(v => v.followed)

  if (followed.length === 0) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <div className="empty-state-title">No saved vendors</div>
          <div className="empty-state-text">Follow vendors to get updates on their products and deals.</div>
          <Link to="/vendors">
            <Button icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>}>Browse Vendors</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)' }}>
      <h3 style={{ marginBottom: 'var(--space-xl)' }}>Saved Vendors <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9375rem' }}>({followed.length})</span></h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
        {followed.map(vendor => (
          <div key={vendor.id} className="card" style={{ padding: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 'var(--space-lg)' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                background: vendor.banner || 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
              }}>
                {vendor.logo}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <Link to={`/vendors/${vendor.slug}`} style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9375rem' }}>{vendor.name}</Link>
                  {newProductIndicators[vendor.id] && (
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)',
                      display: 'inline-block', animation: 'pulse 2s infinite',
                    }} />
                  )}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{vendor.city}, {vendor.state}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  {vendorProductCounts[vendor.id] || 0} products · ⭐ {vendor.rating}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--space-lg)', fontSize: '0.8125rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <div onClick={() => handleToggleNotif(vendor.id, 'notifNewProducts')} style={{
                  width: 36, height: 20, borderRadius: 10, position: 'relative',
                  background: vendor.notifNewProducts ? 'var(--primary)' : 'var(--border)',
                  cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 2, transition: 'left 0.2s',
                    left: vendor.notifNewProducts ? 18 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
                New products
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <div onClick={() => handleToggleNotif(vendor.id, 'notifDeals')} style={{
                  width: 36, height: 20, borderRadius: 10, position: 'relative',
                  background: vendor.notifDeals ? 'var(--primary)' : 'var(--border)',
                  cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 2, transition: 'left 0.2s',
                    left: vendor.notifDeals ? 18 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
                Deals & offers
              </label>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Link to={`/vendors/${vendor.slug}`} style={{ flex: 1, textDecoration: 'none' }}>
                <Button block size="sm" variant="secondary">Visit Store</Button>
              </Link>
              <Button size="sm" variant="danger" onClick={() => handleToggleFollow(vendor.id)}>Unfollow</Button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  )
}
