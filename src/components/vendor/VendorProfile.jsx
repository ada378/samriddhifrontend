import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import Button from '../common/Button'
import Badge from '../common/Badge'
import StarRating from '../common/StarRating'
import ProductCard from '../product/ProductCard'
import VendorRatings from './VendorRatings'
import VendorCertifications from './VendorCertifications'
import VendorMap from './VendorMap'
import Icon from '../../components/common/Icons'

const tierBadge = {
  gold: { label: 'Gold Partner', variant: 'accent' },
  silver: { label: 'Silver Partner', variant: 'info' },
  bronze: { label: 'Bronze Partner', variant: 'soft-primary' },
}

export default function VendorProfile({ vendorSlug }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    Promise.all([
      api.vendors(),
      api.products(),
      api.reviews()
    ]).then(([venRes, prodRes, revRes]) => {
      setVendors(venRes.data || [])
      setProducts(prodRes.data || [])
      setReviews(revRes.data || [])
    }).catch(() => {
      setVendors([])
      setProducts([])
      setReviews([])
    })
  }, [])

  const vendor = useMemo(() => vendors.find(v => v.slug === vendorSlug), [vendorSlug])

  if (!vendor) {
    return (
      <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="empty-state">
            <div className="empty-state-icon"><Icon name="faIndustry" size={24} /></div>
            <div className="empty-state-title">Vendor not found</div>
          <Button onClick={() => navigate('/vendors')}>Browse Vendors</Button>
        </div>
      </div>
    )
  }

  const vendorProducts = products.filter(p => p.vendorId === vendor.id)
  const filteredProducts = categoryFilter === 'all' ? vendorProducts : vendorProducts.filter(p => p.category === categoryFilter)
  const categories = [...new Set(vendorProducts.map(p => p.category))]
  const vendorReviews = reviews.filter(r => r.vendorId === vendor.id)

  const tabs = [
    { id: 'products', label: `Products (${vendorProducts.length})` },
    { id: 'ratings', label: 'Ratings' },
    { id: 'certifications', label: 'Certifications' },
  ]

  return (
    <div>
      <div style={{ background: vendor.banner, height: 200, position: 'relative', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', bottom: -40, left: 32,
          display: 'flex', alignItems: 'flex-end', gap: 16,
        }}>
          <div style={{
            width: 100, height: 100, borderRadius: 'var(--radius-xl)',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '2rem', color: vendor.banner,
            fontFamily: 'var(--font-heading)', boxShadow: 'var(--shadow-lg)',
            border: '3px solid #fff',
          }}>
            {vendor.logo}
          </div>
          <div style={{ paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{vendor.name}</h2>
              {vendor.isVerified && (
                <Badge variant="success" style={{ background: 'var(--success)', fontSize: '0.6875rem' }}>
                  <Icon name="check" size={12} color="#fff" />
                  {' '}Verified
                </Badge>
              )}
              {tierBadge[vendor.tier] && (
                <Badge variant={tierBadge[vendor.tier].variant}>{tierBadge[vendor.tier].label}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 56 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <StarRating rating={vendor.rating} size={16} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{vendor.reviewCount.toLocaleString()} reviews</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{vendor.city}, {vendor.state}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="secondary">
              <Icon name="share" size={14} />
              {' '}Share
            </Button>
            <Button size="sm">
              <Icon name="download" size={14} />
              {' '}Request Quote
            </Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{vendor.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Est. Year', value: vendor.established },
                { label: 'Production Capacity', value: vendor.productionCapacity },
                { label: 'MOQ', value: `${vendor.minOrder} units` },
                { label: 'Delivery', value: vendor.deliveryTime },
              ].map((item, i) => (
                <div key={i} style={{ padding: 12, background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-gray)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
            <h5 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Contact Information</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: 'phone', label: 'Phone', value: '+91 XXXXXXXX' },
                { icon: 'messageSquare', label: 'WhatsApp', value: '+91 XXXXXXXXXX' },
                { icon: 'mail', label: 'Email', value: 'contact@example.com' },
                { icon: 'mapPin', label: 'Address', value: `${vendor.city}, ${vendor.state}` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name={item.icon} size={16} />
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>{item.label}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, background: 'var(--border-light)', borderRadius: 'var(--radius-sm)', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Icon name="globe" size={16} /> Map Embed
            </div>
          </div>
        </div>

        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <button
                onClick={() => setCategoryFilter('all')}
                style={{
                  padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)',
                  background: categoryFilter === 'all' ? 'var(--primary)' : 'transparent',
                  color: categoryFilter === 'all' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 500, fontSize: '0.8125rem', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)',
                    background: categoryFilter === cat ? 'var(--primary)' : 'transparent',
                    color: categoryFilter === cat ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 500, fontSize: '0.8125rem', cursor: 'pointer', textTransform: 'capitalize',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon"><Icon name="mdSalt" size={24} /></div>
                <div className="empty-state-title">No products in this category</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ratings' && (
          <div>
            <VendorRatings rating={vendor.rating} reviewCount={vendor.reviewCount} />
            <div style={{ marginTop: 24 }}>
              <h5 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Buyer Reviews</h5>
              {vendorReviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {vendorReviews.map(review => (
                    <div key={review.id} style={{
                      padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-white)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{review.reviewerName}</span>
                          {review.isVerified && (
                            <Badge variant="soft-success" style={{ marginLeft: 8, fontSize: '0.625rem' }}>Verified</Badge>
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(review.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <StarRating rating={review.rating} size={13} />
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '8px 0 0', lineHeight: 1.5 }}>{review.body}</p>
                      {review.photos?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          {review.photos.map((photo, i) => (
                            <img key={i} src={photo} alt="" style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border)' }} />
                          ))}
                        </div>
                      )}
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Icon name="thumbsUp" size={12} />
                          {review.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No reviews yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div>
            <VendorCertifications certifications={vendor.certifications} />
          </div>
        )}

        <section style={{ marginTop: 48, marginBottom: 48 }}>
          <h3 style={{ marginBottom: 20 }}>Vendor Locations</h3>
          <VendorMap />
        </section>
      </div>

      <div style={{
        position: 'sticky', bottom: 0, background: 'var(--bg-white)',
        borderTop: '1px solid var(--border)', padding: '12px 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', zIndex: 50,
      }} className="mobile-sticky-cta">
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button size="lg" style={{ maxWidth: 400, width: '100%' }}>
<Icon name="download" size={18} />
            Request Quote
          </Button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div:first-child { flex-direction: column !important; }
          .container > div.grid { grid-template-columns: 1fr !important; }
          .mobile-sticky-cta { display: block !important; }
          .container(>) > div:first-child > div:first-child { flex-direction: column !important; }
        }
        @media (min-width: 769px) {
          .mobile-sticky-cta { display: none !important; }
        }
      `}</style>
    </div>
  )
}
