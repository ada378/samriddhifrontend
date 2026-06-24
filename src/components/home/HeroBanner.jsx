import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import Icon from '../common/Icons'

const slides = [
  {
    headline: "India's Trusted Salt Marketplace",
    subtext: 'Connecting verified manufacturers directly to buyers across India. Pure, authentic, and affordable.',
    image: 'https://plus.unsplash.com/premium_photo-1726079119122-eea1b0741c6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2FsdCUyMHBodG98ZW58MHx8MHx8fDA%3D',
  },
  {
    headline: 'Direct from Verified Manufacturers',
    subtext: 'Cut out the middleman. Source directly from FSSAI-certified salt producers with complete traceability.',
    image: 'https://plus.unsplash.com/premium_photo-1726072356923-bf1a9f8faeb0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsdCUyMHBodG98ZW58MHx8MHx8fDA%3D',
  },
  {
    headline: 'Bulk & Retail - Best Prices Guaranteed',
    subtext: 'From 1kg packs to truckload quantities. Live price comparison across 50+ salt varieties.',
    image: 'https://images.unsplash.com/photo-1621315892013-f32af7358947?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2FsdCUyMHBodG98ZW58MHx8MHx8fDA%3D',
  },
]

export default function HeroBanner() {
  const [active, setActive] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const navigate = useNavigate()
  const intervalRef = useRef(null)

  const startInterval = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length)
    }, 5000)
  }, [])

  useEffect(() => {
    startInterval()
    return () => clearInterval(intervalRef.current)
  }, [startInterval])

  const goTo = (index) => {
    setActive(index)
    clearInterval(intervalRef.current)
    startInterval()
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (!touchStart) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo((active + 1) % slides.length)
      else goTo((active - 1 + slides.length) % slides.length)
    }
    setTouchStart(null)
  }

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '580px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("${slide.image}") center/cover no-repeat`,
            opacity: i === active ? 1 : 0,
            transform: i === active ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 80, paddingBottom: 80 }}>
            <div style={{ maxWidth: 640 }}>
              <h1 style={{ color: '#fff', fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 16, lineHeight: 1.15 }}>
                {slide.headline}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)', marginBottom: 32, lineHeight: 1.6, maxWidth: 520 }}>
                {slide.subtext}
              </p>
              <Button size="lg" onClick={() => navigate('/products')}>
                <Icon name="play" size={18} />
                Shop Now
              </Button>
            </div>
            <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', opacity: 0.1, pointerEvents: 'none', fontSize: 'clamp(8rem, 20vw, 18rem)', color: '#fff', fontWeight: 900, lineHeight: 1 }}>
              <Icon name="mdSalt" size={20} />
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
      ))}

      <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10, zIndex: 5 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === active ? 28 : 10,
              height: 10,
              borderRadius: 5,
              border: 'none',
              background: i === active ? '#fff' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      <button
        onClick={() => goTo((active - 1 + slides.length) % slides.length)}
        style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 5, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
        className="desktop-arrow"
        aria-label="Previous slide"
      >
        <Icon name="chevronLeft" size={20} />
      </button>
      <button
        onClick={() => goTo((active + 1) % slides.length)}
        style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 5, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
        className="desktop-arrow"
        aria-label="Next slide"
      >
        <Icon name="chevronRight" size={20} />
      </button>

      <style>{`
        @media (max-width: 768px) {
          .desktop-arrow { display: none; }
        }
      `}</style>
    </section>
  )
}
