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
      className="hero-section"
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className="hero-slide"
          style={{
            opacity: i === active ? 1 : 0,
            transform: i === active ? 'scale(1)' : 'scale(1.05)',
          }}
        >
          <div className="hero-slide-bg" style={{ backgroundImage: `url("${slide.image}")` }} />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <div className="hero-text">
              <h1 className="hero-headline">{slide.headline}</h1>
              <p className="hero-subtext">{slide.subtext}</p>
              <Button size="lg" className="hero-btn" onClick={() => navigate('/products')}>
                <Icon name="arrowRight" size={18} />
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`hero-dot ${i === active ? 'hero-dot-active' : ''}`}
          />
        ))}
      </div>

      <button
        onClick={() => goTo((active - 1 + slides.length) % slides.length)}
        className="hero-arrow hero-arrow-left"
        aria-label="Previous slide"
      >
        <Icon name="chevronLeft" size={20} />
      </button>
      <button
        onClick={() => goTo((active + 1) % slides.length)}
        className="hero-arrow hero-arrow-right"
        aria-label="Next slide"
      >
        <Icon name="chevronRight" size={20} />
      </button>

      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          min-height: 580px;
          display: flex;
          align-items: center;
          background: #000;
        }
        .hero-slide {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .hero-slide-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
        }
        .hero-content {
          position: relative;
          z-index: 2;
          padding-top: 100px;
          padding-bottom: 80px;
        }
        .hero-text {
          max-width: 620px;
        }
        .hero-headline {
          color: #fff;
          font-size: clamp(1.75rem, 5vw, 3rem);
          font-weight: 800;
          margin-bottom: 16px;
          line-height: 1.15;
          font-family: var(--font-heading);
        }
        .hero-subtext {
          color: rgba(255,255,255,0.85);
          font-size: clamp(0.9375rem, 2vw, 1.125rem);
          margin-bottom: 32px;
          line-height: 1.6;
          max-width: 520px;
        }
        .hero-btn {
          background: var(--accent) !important;
          color: var(--text-primary) !important;
          border-color: var(--accent) !important;
          font-weight: 700 !important;
        }
        .hero-btn:hover {
          background: #c49a52 !important;
          border-color: #c49a52 !important;
          box-shadow: var(--shadow-accent) !important;
        }
        .hero-dots {
          position: absolute;
          bottom: 32px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 10px;
          z-index: 5;
        }
        .hero-dot {
          width: 10px;
          height: 10px;
          border-radius: 5px;
          border: none;
          background: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .hero-dot-active {
          width: 28px;
          background: var(--accent);
        }
        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 5;
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
        }
        .hero-arrow:hover {
          background: rgba(255,255,255,0.3);
        }
        .hero-arrow-left { left: 16px; }
        .hero-arrow-right { right: 16px; }

        @media (max-width: 768px) {
          .hero-arrow { display: none; }
          .hero-section { min-height: 460px !important; }
          .hero-content { padding-top: 130px !important; padding-bottom: 48px !important; }
        }
        @media (max-width: 480px) {
          .hero-section { min-height: 440px !important; }
          .hero-content { padding-top: 120px !important; padding-bottom: 40px !important; }
        }
        @media (max-width: 360px) {
          .hero-section { min-height: 420px !important; }
          .hero-content { padding-top: 110px !important; padding-bottom: 36px !important; }
        }
      `}</style>
    </section>
  )
}
