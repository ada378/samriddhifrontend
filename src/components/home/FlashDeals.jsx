import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Icon from '../common/Icons'
import { useApp } from '../../context/AppContext'
import { resolveImage } from '../../api'

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
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {[
        { label: 'Hours', value: time.hours },
        { label: 'Min', value: time.minutes },
        { label: 'Sec', value: time.seconds },
      ].map((unit, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'var(--primary)', color: '#fff', fontWeight: 800, fontSize: '1.125rem', fontFamily: 'var(--font-heading)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', minWidth: 36 }}>{String(unit.value).padStart(2, '0')}</span>
          <span style={{ display: 'block', fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>{unit.label}</span>
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

  useEffect(() => {
    api.products()
      .then(res => setDeals((res.data || []).filter(p => p.discount >= 18).slice(0, 4)))
      .catch(() => setDeals([]))
  }, [])

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    addToCart(product, product.vendorId, product.moq || 1)
    showToast(`${product.name} added to cart!`, 'success')
  }

  const imgSrc = (product) => {
    if (product.images && product.images[0]) return resolveImage(product.images[0])
    return null
  }

  return (
    <section className="section" style={{ background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF8F0 100%)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 'var(--space-3xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 className="section-title" style={{ marginBottom: 0, textAlign: 'left' }}>Flash Deals</h2>
            <span style={{ background: 'var(--danger)', color: '#fff', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase' }}>Limited Time</span>
          </div>
          <Timer target={targetRef.current} />
        </div>

        <div className="flash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {deals.map(product => (
            <Card key={product.id} hover padding="0" style={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${product.slug}`)}>
                <div style={{ position: 'relative' }}>
                  <div style={{ aspectRatio: '1/1', background: 'var(--bg-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', overflow: 'hidden' }}>
                    {!imgErrors[product.id] && imgSrc(product) ? (
                      <img
                        src={imgSrc(product)}
                        alt={product.name}
                        onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Icon name="mdSalt" size={48} color="var(--text-muted)" />
                    )}
                  </div>
                  <Badge variant="danger" style={{ position: 'absolute', top: 8, left: 8 }}>{product.discount}% OFF</Badge>
                </div>
              <div style={{ padding: 12 }}>
                <h5 style={{ fontSize: '0.875rem', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h5>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>₹{product.price}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
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
        @media (max-width: 1024px) {
          section .flash-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          section .flash-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 480px) {
          section .flash-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          section .flash-grid .card img { aspect-ratio: 1/1 !important; }
        }
        @media (max-width: 360px) {
          section .flash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
