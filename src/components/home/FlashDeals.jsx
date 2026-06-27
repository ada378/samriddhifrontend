import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Icon from '../common/Icons'
import { useApp } from '../../context/AppContext'
import { resolveImage } from '../../api'
import featuredProductsData from '../../data/featuredProductsData'

const futureDate = new Date()
futureDate.setDate(futureDate.getDate() + 2)
futureDate.setHours(23, 59, 59, 0)

function calculateTimeLeft(target) {
  const diff = target - Date.now()
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Timer({ target }) {
  const [time, setTime] = useState(() => calculateTimeLeft(target))

  useEffect(() => {
    const id = setInterval(() => setTime(calculateTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div className="flash-timer">
      {[
        { label: 'Hours', value: time.hours },
        { label: 'Min', value: time.minutes },
        { label: 'Sec', value: time.seconds },
      ].map((unit, i) => (
        <div key={i} className="flash-timer-unit">
          <span className="flash-timer-value">{String(unit.value).padStart(2, '0')}</span>
          <span className="flash-timer-label">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function FlashDeals() {
  const navigate = useNavigate()
  const { addToCart, showToast } = useApp()
  const targetRef = useRef(futureDate)
  const [deals, setDeals] = useState([])
  const [imgErrors, setImgErrors] = useState({})

  const fallbackDeals = featuredProductsData.slice(0, 4).map((p, i) => ({
    ...p,
    discount: [18, 20, 22, 25][i],
    originalPrice: [30, 40, 50, 60][i],
    price: [25, 32, 39, 45][i],
    vendorId: 'V001',
    images: [],
    _localImg: p.image,
  }))

  useEffect(() => {
    api.products()
      .then(res => setDeals((res.data || []).filter(p => p.discount >= 18).slice(0, 4)))
      .catch(() => setDeals(fallbackDeals))
  }, [])

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    addToCart(product, product.vendorId, product.moq || 1)
    showToast(`${product.name} added to cart!`, 'success')
  }

  const imgSrc = (product) => {
    if (product.images && product.images[0]) return resolveImage(product.images[0])
    if (product._localImg) return product._localImg
    return null
  }

  return (
    <section className="section flash-section">
      <div className="container">
        <div className="flash-header">
          <div className="flash-title-group">
            <h2 className="section-title" style={{ marginBottom: 0, textAlign: 'left' }}>Flash Deals</h2>
            <span className="flash-badge">Limited Time</span>
          </div>
          <Timer target={targetRef.current} />
        </div>

        <div className="flash-grid">
          {deals.map(product => (
            <Card key={product.id} hover padding="0" className="flash-card" onClick={() => navigate(`/products/${product.slug}`)}>
                <div className="flash-img-wrap">
                  <div className="flash-img-inner">
                    {!imgErrors[product.id] && imgSrc(product) ? (
                      <img
                        src={imgSrc(product)}
                        alt={product.name}
                        onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                        className="flash-img"
                      />
                    ) : (
                      <Icon name="mdSalt" size={48} color="var(--text-muted)" />
                    )}
                  </div>
                  <Badge variant="danger" className="flash-discount-badge">{product.discount}% OFF</Badge>
                </div>
              <div className="flash-card-body">
                <h5 className="flash-product-name">{product.name}</h5>
                <div className="flash-pricing">
                  <span className="flash-price">₹{product.price}</span>
                  <span className="flash-original-price">₹{product.originalPrice}</span>
                </div>
                <div className="flash-actions">
                  <Button size="sm" block variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.slug}`) }}>
                    View
                  </Button>
                  <Button size="sm" block onClick={(e) => handleAddToCart(e, product)}>
                    <Icon name="arrowRight" size={14} /> Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        .flash-section {
          background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #fff8e1 100%);
        }
        .flash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: var(--space-3xl);
        }
        .flash-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .flash-badge {
          background: var(--danger);
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .flash-timer {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .flash-timer-unit {
          text-align: center;
        }
        .flash-timer-value {
          display: inline-block;
          background: var(--primary);
          color: #fff;
          font-weight: 800;
          font-size: 1.125rem;
          font-family: var(--font-heading);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          min-width: 36px;
        }
        .flash-timer-label {
          display: block;
          font-size: 0.625rem;
          color: var(--text-muted);
          margin-top: 2px;
          text-transform: uppercase;
          font-weight: 600;
        }
        .flash-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .flash-card {
          cursor: pointer;
          overflow: hidden;
        }
        .flash-img-wrap {
          position: relative;
        }
        .flash-img-inner {
          aspect-ratio: 1/1;
          background: var(--bg-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          overflow: hidden;
        }
        .flash-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .flash-discount-badge {
          position: absolute;
          top: 8px;
          left: 8px;
        }
        .flash-card-body {
          padding: 12px;
        }
        .flash-product-name {
          font-size: 0.875rem;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .flash-pricing {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 10px;
        }
        .flash-price {
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--primary);
          font-family: var(--font-heading);
        }
        .flash-original-price {
          font-size: 0.8125rem;
          color: var(--text-muted);
          text-decoration: line-through;
        }
        .flash-actions {
          display: flex;
          gap: 6px;
        }

        @media (max-width: 1024px) {
          .flash-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .flash-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 480px) {
          .flash-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .flash-img-inner { aspect-ratio: 1/1 !important; }
        }
        @media (max-width: 360px) {
          .flash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
