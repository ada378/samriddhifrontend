import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { resolveImage } from '../../api'
import Card from '../common/Card'
import { useApp } from '../../context/AppContext'

export default function RecentlyViewed() {
  const navigate = useNavigate()
  const { recentlyViewed } = useApp()
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.products()
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
  }, [])

  const items = recentlyViewed || []
  if (items.length === 0) return null

  const productItems = items.slice(0, 6).map(id => products.find(p => p.id === id)).filter(Boolean)

  if (productItems.length === 0) return null

  return (
    <section className="section" style={{ background: 'var(--bg-white)' }}>
      <div className="container">
        <h2 className="section-title">Recently Viewed</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {productItems.map(product => (
            <Card key={product.id} hover padding="0" style={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${product.slug}`)}>
              <div style={{ aspectRatio: '1/1', background: 'var(--bg-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', overflow: 'hidden' }}>
                <img src={resolveImage(product.images?.[0], product.category)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 8 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</p>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>₹{product.price}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 375px) {
          .container > div { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
