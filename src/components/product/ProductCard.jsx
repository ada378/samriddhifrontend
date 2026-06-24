import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { resolveImage } from '../../api'
import Card from '../common/Card'
import Badge from '../common/Badge'
import StarRating from '../common/StarRating'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'

const badgeVariantMap = {
  'Bestseller': 'primary',
  'Trusted': 'success',
  'Health': 'info',
  'Low Sodium': 'info',
  'Grinder Friendly': 'accent',
  'Natural': 'success',
  'Mineral Rich': 'accent',
  'Bulk Supply': 'warning',
  'Industrial': 'warning',
  'Solar Evaporated': 'success',
  'Artisan': 'accent',
  'Limited Batch': 'warning',
  'Premium': 'primary',
  'Best Seller': 'danger',
  'New': 'info',
  'Bulk Deal': 'warning',
  'Organic Certified': 'success',
  'Export Quality': 'primary',
}

export default function ProductCard({ product, view = 'grid' }) {
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useApp()
  const [imgError, setImgError] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product, product.vendorId, 1)
    showToast(`${product.name} added to cart`, 'success')
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    toggleWishlist(product.id)
    showToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', 'info')
  }

  const isGrid = view === 'grid'

  return (
    <Card
      hover
      padding="0"
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        display: isGrid ? 'flex' : 'flex',
        flexDirection: isGrid ? 'column' : 'row',
      }}
      onClick={() => navigate(`/products/${product.slug}`)}
    >
      <div
        style={{
          position: 'relative',
          flex: isGrid ? 'none' : '0 0 180px',
          aspectRatio: isGrid ? '1/1' : 'auto',
          background: 'var(--bg-gray)',
          overflow: 'hidden',
        }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        {!imgError ? (
          <img
            src={resolveImage(product.images[0])}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: zoomed ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--text-muted)', background: 'var(--bg-gray)' }}>
            <Icon name="mdSalt" size={24} />
          </div>
        )}
        {product.badges && product.badges.length > 0 && (
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {product.badges.slice(0, 2).map((badge, i) => (
              <Badge key={i} variant={badgeVariantMap[badge] || 'primary'}>{badge}</Badge>
            ))}
          </div>
        )}
        {product.discount > 0 && (
          <Badge variant="danger" style={{ position: 'absolute', top: 8, right: 8 }}>{product.discount}% OFF</Badge>
        )}
      </div>

      <div style={{
        padding: isGrid ? 12 : 16,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <h5 style={{ fontSize: isGrid ? '0.875rem' : '1rem', marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h5>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
            by {product.vendorId}
          </span>
          <StarRating rating={product.ratings} size={14} />
          {!isGrid && <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '8px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>₹{product.price}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {product.packaging}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MOQ: {product.moq}</span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <Button size="sm" onClick={handleAddToCart} style={{ flex: 1 }}>
              <Icon name="cart" size={14} />
              Add
            </Button>
            <button
              onClick={handleWishlist}
              style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                background: inWishlist ? 'var(--primary-light)' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
              }}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Icon name="heart" size={16} color={inWishlist ? 'var(--danger)' : 'var(--text-muted)'} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
