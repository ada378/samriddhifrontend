import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Icon from '../common/Icons'

import saltImg1 from '../../assets/blacksalt.png'
import saltImg2 from '../../assets/salt2.png'
import saltImg3 from '../../assets/saltimage1.png'
import saltImg4 from '../../assets/saltimage3.png'
import saltImg5 from '../../assets/samridhiimg1.png'
import saltImg6 from '../../assets/blacksalt (2).png'

const products = [
  { id: 1, name: 'Black Salt (Kala Namak)', slug: 'black-salt', image: saltImg1, badge: 'Bestseller', description: 'Himalayan black salt, rich in minerals with a distinct sulfurous flavor. Used in Ayurveda for digestion and commonly added to chaat, fruits, and raita in Indian cuisine.' },
  { id: 2, name: 'Rock Salt (Sendha Namak)', slug: 'rock-salt', image: saltImg2, badge: 'Trusted', description: 'Pure crystalline Himalayan rock salt, unprocessed and natural. Used during Hindu fasting (vrat) and known for its cooling properties in Ayurvedic medicine.' },
  { id: 3, name: 'Sea Salt (Samudri Namak)', slug: 'sea-salt', image: saltImg3, badge: 'Natural', description: 'Sun-evaporated sea salt from coastal regions, rich in trace minerals. Contains natural iodine and is less processed than regular table salt.' },
  { id: 4, name: 'Iodized Table Salt', slug: 'iodized-salt', image: saltImg4, badge: 'Health', description: 'Fortified with iodine to prevent thyroid disorders. The most commonly used salt in Indian households for daily cooking and food preparation.' },
  { id: 5, name: 'Pink Himalayan Salt', slug: 'pink-himalayan-salt', image: saltImg5, badge: 'Premium', description: 'Hand-mined from Khewra Salt Mine in Pakistan. Rich in 84+ minerals giving it a pink hue. Popular in gourmet cooking and salt lamps.' },
  { id: 6, name: 'Industrial Grade Salt', slug: 'industrial-salt', image: saltImg6, badge: 'Bulk Supply', description: 'High-purity sodium chloride for industrial applications including water softening, chemical processing, textile dyeing, and de-icing.' },
  { id: 7, name: 'Garlic Salt (Lasoon Namak)', slug: 'garlic-salt', image: saltImg2, badge: 'Flavored', description: 'Premium salt blended with roasted garlic granules. Perfect for seasoning meats, vegetables, and salads with a savory garlic kick.' },
  { id: 8, name: 'Lemon Salt (Nimbu Namak)', slug: 'lemon-salt', image: saltImg3, badge: 'Citrus', description: 'Zesty lemon-infused salt made with natural lemon extract. Adds a tangy punch to salads, drinks, and seafood.' },
  { id: 9, name: 'Smoked Salt', slug: 'smoked-salt', image: saltImg5, badge: 'Gourmet', description: 'Naturally cold-smoked over wood chips for a rich, smoky flavor. Ideal for BBQ, grilled meats, and rustic dishes.' },
  { id: 10, name: 'Low Sodium Salt', slug: 'low-sodium-salt', image: saltImg4, badge: 'Health', description: 'Reduced sodium alternative with potassium chloride. Perfect for health-conscious individuals managing blood pressure.' },
  { id: 11, name: 'Masala Salt (Spiced Salt)', slug: 'masala-salt', image: saltImg1, badge: 'Popular', description: 'Aromatic spiced salt blended with traditional Indian masalas. A zesty seasoning for chaat, fruits, and everyday snacks.' },
]

const badgeVariantMap = {
  'Bestseller': 'primary',
  'Trusted': 'success',
  'Health': 'info',
  'Natural': 'success',
  'Premium': 'primary',
  'Bulk Supply': 'warning',
  'Flavored': 'info',
  'Citrus': 'warning',
  'Gourmet': 'primary',
  'Popular': 'success',
}

export default function FeaturedProducts() {
  const navigate = useNavigate()
  const [imgErrors, setImgErrors] = useState({})

  return (
    <section className="section" style={{ background: 'var(--bg-white)' }}>
      <div className="container">
        <h2 className="section-title">Products in the Spotlight</h2>
        <p className="featured-subtitle">
          Know your salt — tap any product to read its complete details
        </p>
        <div className="featured-products-grid">
          {products.map(product => (
              <Card key={product.id} hover padding="0" className="featured-product-card" onClick={() => navigate(`/featured/${product.slug}`)}>
              <div className="featured-img-wrap">
                {!imgErrors[product.id] ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                    className="featured-product-img"
                  />
                ) : (
                  <div className="featured-img-fallback">
                    <Icon name="mdSalt" size={48} />
                  </div>
                )}
                {product.badge && (
                  <Badge variant={badgeVariantMap[product.badge] || 'primary'} className="featured-badge">{product.badge}</Badge>
                )}
              </div>
              <div className="featured-card-content">
                <h5 className="featured-card-title">{product.name}</h5>
                <p className="featured-card-desc">{product.description}</p>
                <Button size="sm" variant="secondary" className="featured-card-btn" onClick={(e) => { e.stopPropagation(); navigate(`/featured/${product.slug}`) }}>
                  <Icon name="eye" size={14} /> View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="featured-cta">
          <Button size="lg" onClick={() => navigate('/products')}>
            <Icon name="arrowRight" size={18} /> Browse All Products
          </Button>
        </div>
      </div>

      <style>{`
        .featured-subtitle {
          text-align: center;
          color: var(--text-muted);
          margin-bottom: 32px;
          font-size: 0.9375rem;
          margin-top: -16px;
        }
        .featured-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .featured-product-card {
          overflow: hidden;
          border-radius: var(--radius-lg);
        }
        .featured-img-wrap {
          position: relative;
          aspect-ratio: 1/1;
          background: var(--bg-gray);
          overflow: hidden;
        }
        .featured-product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .featured-product-card:hover .featured-product-img {
          transform: scale(1.1);
        }
        .featured-img-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: var(--text-muted);
          background: var(--bg-gray);
        }
        .featured-badge {
          position: absolute;
          top: 8px;
          left: 8px;
        }
        .featured-card-content {
          padding: 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .featured-card-title {
          font-size: 0.9375rem;
          font-weight: 700;
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .featured-card-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .featured-card-btn {
          align-self: stretch;
        }
        .featured-cta {
          text-align: center;
          margin-top: 32px;
        }
        @media (max-width: 1024px) {
          .featured-products-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 768px) {
          .featured-products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .featured-card-content { padding: 10px; }
          .featured-card-title { font-size: 0.875rem; }
          .featured-card-desc { font-size: 0.75rem; -webkit-line-clamp: 3; }
        }
        @media (max-width: 560px) {
          .featured-products-grid { grid-template-columns: 1fr; gap: 16px; }
          .featured-card-content { padding: 12px 16px; }
          .featured-card-title { font-size: 1rem; }
          .featured-card-desc { font-size: 0.85rem; -webkit-line-clamp: 4; }
          .featured-subtitle { font-size: 0.85rem; padding: 0 12px; }
        }
      `}</style>
    </section>
  )
}
