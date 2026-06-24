import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import Card from '../common/Card'
import StarRating from '../common/StarRating'
import Button from '../common/Button'
import Icon from '../common/Icons'

export default function FeaturedVendors() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    api.vendors()
      .then(res => setVendors(res.data || []))
      .catch(() => setVendors([]))
  }, [])

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' })
    }
  }

  return (
    <section className="section" style={{ background: 'var(--bg-warm)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3xl)' }}>
          <h2 className="section-title" style={{ marginBottom: 0, textAlign: 'left' }}>Featured Vendors</h2>
          <div style={{ display: 'flex', gap: 8 }} className="desktop-scroll-arrows">
            <button onClick={() => scroll(-1)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-white)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <Icon name="chevronLeft" size={18} />
            </button>
            <button onClick={() => scroll(1)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-white)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <Icon name="chevronRight" size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 8,
            scrollbarWidth: 'none',
          }}
          className="hide-scrollbar"
        >
          {vendors.map(vendor => (
            <div key={vendor.id} style={{ flex: '0 0 280px', scrollSnapAlign: 'start' }}>
              <Card hover padding="0" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: vendor.banner, padding: '20px 20px 48px', position: 'relative' }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.125rem',
                    color: '#fff',
                    fontFamily: 'var(--font-heading)',
                  }}>
                    {vendor.logo}
                  </div>
                  {vendor.isVerified && (
                    <span style={{ position: 'absolute', top: 16, right: 16, background: 'var(--success)', color: '#fff', borderRadius: 'var(--radius-full)', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                      <Icon name="check" size={12} color="#fff" />
                    </span>
                  )}
                </div>
                <div style={{ padding: '8px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: 2 }}>{vendor.name}</h4>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    {vendor.city}, {vendor.state}
                  </span>
                  <StarRating rating={vendor.rating} size={14} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                    Top: {vendor.topProducts[0]}
                  </span>
                  <div style={{ marginTop: 'auto' }}>
                    <Button size="sm" variant="secondary" block onClick={() => navigate(`/vendors/${vendor.slug}`)}>
                      View Profile
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) { .desktop-scroll-arrows { display: none; } }
      `}</style>
    </section>
  )
}
