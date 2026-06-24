import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import Card from '../common/Card'
import { CategoryIcon } from '../common/Icons'

const categoryColors = {
  'rock-salt': '#EF9F27',
  'sea-salt': '#1D9E75',
  'iodized-salt': '#CC0C2C',
  'sendha-namak': '#534AB7',
  'black-salt': '#2D2D4A',
  'industrial-salt': '#6B7280',
  'organic-salt': '#1D9E75',
  'flavoured-salt': '#E8B830',
}

export default function CategoryGrid() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.categories()
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
  }, [])

  return (
    <section className="section" style={{ background: 'var(--bg-white)' }}>
      <div className="container">
        <h2 className="section-title">Explore Salt Categories</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}>
          {categories.map(cat => {
            const color = categoryColors[cat.slug] || 'var(--primary)'
            return (
              <Card key={cat.id} hover padding="0">
                <button
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    padding: '28px 16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'transform 0.2s',
                    borderRadius: 'var(--radius-lg)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <span style={{
                    fontSize: '2.5rem',
                    width: 72,
                    height: 72,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${color}15`,
                    borderRadius: 'var(--radius-xl)',
                    transition: 'background 0.2s',
                  }}>
                    <CategoryIcon name={cat.name} size={32} />
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{cat.name}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{cat.productCount} Products</span>
                </button>
              </Card>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          section .container > div { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          section .container > div { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 480px) {
          section .container > div { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          section .container > div button { padding: 16px 12px !important; }
          section .container > div span:first-of-type { width: 56px !important; height: 56px !important; font-size: 1.75rem !important; }
        }
        @media (max-width: 360px) {
          section .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
