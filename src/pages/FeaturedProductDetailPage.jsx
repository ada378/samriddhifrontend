import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Icon from '../components/common/Icons'
import featuredProductsData from '../data/featuredProductsData'

const badgeVariantMap = {
  'Bestseller': 'primary',
  'Trusted': 'success',
  'Health': 'info',
  'Natural': 'success',
  'Premium': 'primary',
  'Bulk Supply': 'warning',
}

export default function FeaturedProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = featuredProductsData.find(p => p.slug === slug)

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="mdSalt" size={24} /></div>
          <div className="empty-state-title">Product not found</div>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <button
        onClick={() => navigate(-1)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 16 }}
      >
        <Icon name="arrowLeft" size={16} /> Back
      </button>

      <div className="fp-detail-layout">
        <div className="fp-detail-image-col">
          <div className="fp-detail-image-wrap">
            <img src={product.image} alt={product.name} className="fp-detail-image" />
          </div>
        </div>

        <div className="fp-detail-info-col">
          <div style={{ marginBottom: 8 }}>
            <Badge variant={badgeVariantMap[product.badge] || 'primary'} size="sm">{product.badge}</Badge>
          </div>
          <h1 className="fp-detail-title">{product.name}</h1>
          <p className="fp-detail-origin"><Icon name="mapPin" size={14} /> {product.origin}</p>
          <p className="fp-detail-desc">{product.description}</p>

          <div className="fp-detail-mineral-box">
            <h4><Icon name="mdSalt" size={16} /> Mineral Composition</h4>
            <p>{product.mineralContent}</p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
            <Button onClick={() => navigate('/products')}>
              <Icon name="arrowRight" size={16} /> Browse All Products
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              <Icon name="home" size={16} /> Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="fp-detail-sections">
        <div className="fp-detail-card">
          <h3><Icon name="checkCircle" size={18} color="var(--success)" /> Key Benefits</h3>
          <ul className="fp-detail-list">
            {product.benefits.map((b, i) => (
              <li key={i}><Icon name="check" size={14} color="var(--success)" /> {b}</li>
            ))}
          </ul>
        </div>

        <div className="fp-detail-card">
          <h3><Icon name="bookmark" size={18} color="var(--primary)" /> Common Uses</h3>
          <ul className="fp-detail-list">
            {product.uses.map((u, i) => (
              <li key={i}><Icon name="check" size={14} color="var(--primary)" /> {u}</li>
            ))}
          </ul>
        </div>

        <div className="fp-detail-card">
          <h3><Icon name="clipboard" size={18} color="var(--secondary)" /> Chemical Analysis</h3>
          <div className="fp-detail-table">
            {Object.entries(product.chemicalAnalysis).map(([key, value]) => (
              <div key={key} className="fp-detail-table-row">
                <span className="fp-detail-table-label">{key}</span>
                <span className="fp-detail-table-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .fp-detail-layout {
          display: flex;
          gap: 40px;
          margin-bottom: 40px;
        }
        .fp-detail-image-col {
          flex: 0 0 400px;
          max-width: 100%;
        }
        .fp-detail-image-wrap {
          aspect-ratio: 1/1;
          background: var(--bg-gray);
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .fp-detail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fp-detail-info-col {
          flex: 1;
          min-width: 0;
        }
        .fp-detail-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 8px;
          font-family: var(--font-heading);
        }
        .fp-detail-origin {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .fp-detail-desc {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .fp-detail-mineral-box {
          background: var(--primary-light);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 8px;
        }
        .fp-detail-mineral-box h4 {
          font-size: 0.9375rem;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--primary);
        }
        .fp-detail-mineral-box p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }
        .fp-detail-sections {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .fp-detail-card {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
        }
        .fp-detail-card h3 {
          font-size: 1.0625rem;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .fp-detail-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .fp-detail-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .fp-detail-list li:first-child {
          padding-top: 0;
        }
        .fp-detail-list li:last-child {
          padding-bottom: 0;
        }
        .fp-detail-table {
          display: flex;
          flex-direction: column;
        }
        .fp-detail-table-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-light);
          font-size: 0.85rem;
        }
        .fp-detail-table-row:last-child {
          border-bottom: none;
        }
        .fp-detail-table-label {
          color: var(--text-muted);
          font-weight: 500;
        }
        .fp-detail-table-value {
          color: var(--text-primary);
          font-weight: 600;
        }
        @media (max-width: 1024px) {
          .fp-detail-layout { gap: 28px; }
          .fp-detail-image-col { flex-basis: 340px; }
          .fp-detail-sections { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .fp-detail-layout { flex-direction: column; gap: 24px; }
          .fp-detail-image-col { flex-basis: auto; max-width: 360px; }
          .fp-detail-title { font-size: 1.375rem; }
          .fp-detail-sections { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .fp-detail-image-col { max-width: 100%; }
          .fp-detail-title { font-size: 1.25rem; }
          .fp-detail-card { padding: 16px; }
        }
      `}</style>
    </div>
  )
}
