import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { resolveImage } from '../../api'
import Card from '../common/Card'
import StarRating from '../common/StarRating'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'

export default function VendorCard({ vendor }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.products()
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
  }, [])

  const vendorProducts = products.filter(p => p.vendorId === vendor.id).slice(0, 3)

  return (
    <Card hover padding="0" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: vendor.banner, padding: 20, position: 'relative' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '1.125rem', color: '#fff',
          fontFamily: 'var(--font-heading)',
        }}>
          {vendor.logo}
        </div>
        {vendor.isVerified && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--success)', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={14} color="#fff" />
          </span>
        )}
      </div>

      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ fontSize: '1rem', marginBottom: 2 }}>{vendor.name}</h4>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
          {vendor.city}, {vendor.state}
        </span>
        <StarRating rating={vendor.rating} size={14} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
          {vendor.reviewCount.toLocaleString()} reviews
        </span>

        {vendorProducts.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {vendorProducts.map(p => (
              <div
                key={p.id}
                style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-gray)', overflow: 'hidden', flexShrink: 0,
                  border: '1px solid var(--border-light)',
                }}
              >
                <img src={resolveImage(p.images[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Min Order: {vendor.minOrder} units | Delivery: {vendor.deliveryTime}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" style={{ flex: 1 }} onClick={() => navigate(`/vendors/${vendor.slug}`)}>
            View Profile
          </Button>
          <Button size="sm" style={{ flex: 1 }}>
            Get Quote
          </Button>
        </div>
      </div>
    </Card>
  )
}
