import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import api, { resolveImage } from '../../api'
import Button from '../common/Button'
import Badge from '../common/Badge'
import StarRating from '../common/StarRating'
import Card from '../common/Card'
import PricingMatrix from './PricingMatrix'
import BulkOrderCalculator from './BulkOrderCalculator'
import SpecsTable from './SpecsTable'
import ProductFAQ from './ProductFAQ'
import ProductCard from './ProductCard'
import Icon from '../../components/common/Icons'

export default function ProductDetail({ productSlug }) {
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist, addToCompare, isInCompare, removeFromCompare, showToast } = useApp()
  const [product, setProduct] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setLoading(true)
    api.product(productSlug)
      .then(res => {
        const p = res.data
        setProduct(p)
        setQuantity(p.moq || 1)
        return Promise.all([api.vendors(), api.products()])
          .then(([venRes, prodRes]) => {
            const vens = venRes.data || []
            const prods = prodRes.data || []
            setVendor(vens.find(v => v.id === p.vendorId))
            setRelatedProducts(prods.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4))
          })
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [productSlug])

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="mdSalt" size={24} /></div>
          <div className="empty-state-title">Loading...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="mdSalt" size={24} /></div>
          <div className="empty-state-title">Product not found</div>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)
  const inCompare = isInCompare(product.id)

  const stockLevel = product.stock > 100 ? 'in-stock' : product.stock > 10 ? 'low-stock' : 'out-of-stock'
  const stockLabel = stockLevel === 'in-stock' ? 'In Stock' : stockLevel === 'low-stock' ? `Only ${product.stock} left` : 'Out of Stock'
  const stockColor = stockLevel === 'in-stock' ? 'var(--success)' : stockLevel === 'low-stock' ? 'var(--warning)' : 'var(--danger)'

  const handleAddToCart = () => {
    addToCart(product, product.vendorId, quantity)
    showToast('Added to cart!', 'success')
  }

  const handleZoom = (e) => {
    if (!zoom) return
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ display: 'flex', gap: 32, marginBottom: 48 }}>
        <div style={{ flex: '0 0 480px', maxWidth: '100%' }}>
          <div
            style={{
              position: 'relative',
              aspectRatio: '1/1',
              background: 'var(--bg-gray)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              cursor: zoom ? 'zoom-out' : 'zoom-in',
            }}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleZoom}
          >
            <img
              src={resolveImage(product.images?.[selectedImage], product.category)}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: zoom ? 'scale(2)' : 'scale(1)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transition: zoom ? 'none' : 'transform 0.3s',
              }}
            />
            {product.badges?.includes('Bestseller') && (
              <Badge variant="primary" style={{ position: 'absolute', top: 12, left: 12 }}>Best Seller</Badge>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                style={{
                  width: 72, height: 72, borderRadius: 'var(--radius-md)', overflow: 'hidden',
                  border: i === selectedImage ? '2px solid var(--primary)' : '2px solid var(--border)',
                  padding: 0, cursor: 'pointer', flexShrink: 0,
                  background: 'var(--bg-gray)',
                  transition: 'border-color 0.2s',
                }}
              >
                <img src={resolveImage(img, product.category)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {product.badges?.map((badge, i) => (
              <Badge key={i} variant={i === 0 ? 'primary' : 'soft-primary'}>{badge}</Badge>
            ))}
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{product.name}</h1>
          {vendor && (
            <button
              onClick={() => navigate(`/vendors/${vendor.slug}`)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.875rem', color: 'var(--text-link)', fontWeight: 500, marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              by {vendor.name}
              {vendor.isVerified && (
                <Icon name="shield" size={14} color="var(--success)" />
              )}
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <StarRating rating={product.ratings} size={16} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>({product.reviewCount} reviews)</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {product.id}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>₹{product.price}</span>
            {product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: '1.125rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
                <Badge variant="danger">{product.discount}% OFF</Badge>
              </>
            )}
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            {product.packaging} | {product.grade} | MOQ: {product.moq} units
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: stockColor, display: 'inline-block' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: stockColor }}>{stockLabel}</span>
            {stockLevel === 'low-stock' && (
              <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}><Icon name="alertTriangle" size={14} /> Selling fast!</span>
            )}
          </div>

          {stockLevel !== 'out-of-stock' && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <div className="quantity-stepper">
                <button onClick={() => setQuantity(q => Math.max(product.moq, q - 1))} disabled={quantity <= product.moq}>−</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value) || product.moq))} min={product.moq} />
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
              <Button onClick={handleAddToCart}>
                <Icon name="arrowRight" size={16} />
                Add to Cart
              </Button>
              <Button variant="secondary" onClick={() => { handleAddToCart(); navigate('/checkout') }}>
                Buy Now
              </Button>
            </div>
          )}

          {stockLevel === 'out-of-stock' && (
            <Button variant="secondary" style={{ marginBottom: 16 }}>
              <Icon name="bell" size={16} /> Notify When Available
            </Button>
          )}

          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <button
              onClick={() => { toggleWishlist(product.id); showToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', 'info') }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', background: inWishlist ? 'var(--primary-light)' : 'transparent',
                cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, color: inWishlist ? 'var(--primary)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <Icon name="heart" size={16} />
              Wishlist
            </button>
            <button
              onClick={() => { inCompare ? removeFromCompare(product.id) : addToCompare(product.id); showToast(inCompare ? 'Removed from compare' : 'Added to compare', 'info') }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', background: inCompare ? 'var(--info-light)' : 'transparent',
                cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, color: inCompare ? 'var(--info)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <Icon name="sliders" size={16} />
              Compare
            </button>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast('Link copied!', 'success') }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer', fontSize: '0.8125rem',
                fontWeight: 500, color: 'var(--text-secondary)', transition: 'all 0.2s',
              }}
            >
              <Icon name="share" size={16} />
              Share
            </button>
          </div>

          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>

          {product.specs && <SpecsTable specs={product.specs} />}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 32, maxWidth: 700 }}>
        <PricingMatrix basePrice={product.price} unit={product.packaging || 'unit'} />
        <BulkOrderCalculator basePrice={product.price} unit={product.packaging || 'unit'} moq={product.moq} />
        <ProductFAQ faqs={product.faq} />
      </div>

      {product.specs?.['Chemical Analysis'] && (
        <div style={{ marginTop: 24 }}>
          <Button variant="secondary" size="sm">
            <Icon name="download" size={14} />
            {' '}Download Chemical Analysis Report
          </Button>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h3 style={{ marginBottom: 20 }}>Related Products</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <style>{`
            @media (max-width: 1024px) { .container > section > div { grid-template-columns: repeat(3, 1fr) !important; } }
            @media (max-width: 768px) { .container > section > div { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }
            @media (max-width: 480px) { .container > section > div { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; } }
            @media (max-width: 360px) { .container > section > div { grid-template-columns: 1fr !important; } }
          `}</style>
        </section>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .container > div:first-child { gap: 24px !important; }
          .container > div:first-child > div:first-child { flex: 0 0 380px !important; }
        }
        @media (max-width: 768px) {
          .container > div:first-child { flex-direction: column !important; gap: 20px !important; }
          .container > div:first-child > div:first-child { flex-basis: auto !important; max-width: 100% !important; }
          .container > div:first-child > div:first-child > div:last-child { flex-wrap: wrap !important; }
          .container > div:first-child > div:first-child > div:last-child button { width: 56px !important; height: 56px !important; }
          .container > div:first-child > div:last-child h1 { font-size: 1.25rem !important; }
        }
        @media (max-width: 480px) {
          .container > div:first-child > div:first-child > div:last-child button { width: 48px !important; height: 48px !important; }
          .container > div:first-child > div:last-child > div:nth-child(5) { flex-direction: column !important; }
          .container > div:first-child > div:last-child > div:nth-child(5) .quantity-stepper { width: 100% !important; justify-content: center !important; }
          .container > div:first-child > div:last-child > div:nth-child(5) button { flex: 1 !important; }
          .container > div:first-child > div:last-child > div:nth-child(6) { flex-wrap: wrap !important; }
          .container > div:first-child > div:last-child > div:nth-child(6) button { flex: 1 !important; min-width: 0 !important; justify-content: center !important; }
        }
      `}</style>
    </div>
  )
}
