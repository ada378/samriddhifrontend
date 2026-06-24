import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import api from '../../api'
import Button from '../common/Button'

const LISTS = { 'default': 'All Items', 'monthly-stock': 'Monthly Stock', 'compare-later': 'Compare Later' }

export default function Wishlist() {
  const { wishlist: wishlistIds, toggleWishlist, addToCart, showToast } = useApp()
  const [activeList, setActiveList] = useState('default')
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.products()
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
  }, [])

  const wishlistProducts = useMemo(() => {
    return products.filter(p => wishlistIds.includes(p.id))
  }, [wishlistIds])

  const handleMoveToCart = (product, e) => {
    e.stopPropagation()
    addToCart(product, product.vendorId, 1)
    showToast(`${product.name} added to cart`, 'success')
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="empty-state-title">Your wishlist is empty</div>
          <div className="empty-state-text">Save your favorite salt products to revisit them later.</div>
          <Link to="/">
            <Button icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>}>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ fontSize: '1.25rem' }}>My Wishlist <span style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', fontWeight: 400 }}>({wishlistProducts.length} items)</span></h3>
        <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none', gap: 4 }}>
          {Object.entries(LISTS).map(([key, label]) => (
            <button key={key} className={`tab ${activeList === key ? 'active' : ''}`} onClick={() => setActiveList(key)} style={{ fontSize: '0.8125rem', padding: '6px 14px' }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
        {wishlistProducts.map(product => (
          <div key={product.id} style={{
            border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
            overflow: 'hidden', background: 'var(--bg-white)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ position: 'relative', paddingTop: '100%', background: 'var(--bg-gray)' }}>
              <img src={product.images?.[0]} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => toggleWishlist(product.id)} style={{
                position: 'absolute', top: 8, right: 8, width: 32, height: 32,
                borderRadius: '50%', background: 'var(--bg-white)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--danger)" stroke="var(--danger)" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            <div style={{ padding: 'var(--space-lg)' }}>
              <Link to={`/products/${product.slug}`} style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)', textDecoration: 'none', display: 'block', marginBottom: 4 }}>{product.name}</Link>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 8 }}>by {product.vendorId ? `Vendor` : 'Unknown'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
                )}
                {product.discount > 0 && <span className="badge badge-soft-success">{product.discount}% off</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" block onClick={(e) => handleMoveToCart(product, e)} icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                }>Move to Cart</Button>
                <button onClick={() => toggleWishlist(product.id)} style={{
                  padding: '6px 10px', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)',
                  background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8125rem',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
