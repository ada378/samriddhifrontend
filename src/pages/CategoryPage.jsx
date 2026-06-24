import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import Icon, { CategoryIcon } from '../components/common/Icons'

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.categories().then(res => {
      const cat = (res.data || []).find(c => c.slug === slug)
      setCategory(cat || null)
    }).catch(() => setCategory(null)).finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-5xl) 16px', textAlign: 'center' }}>
        <div className="admin-loading">Loading...</div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container" style={{ padding: 'var(--space-5xl) 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
        <h2>Category not found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px' }}>The category you're looking for doesn't exist.</p>
        <Link to="/products" className="btn btn-primary" style={{ textDecoration: 'none' }}>Browse Products</Link>
      </div>
    )
  }

  const { details } = category

  return (
    <div className="container" style={{ padding: 'var(--space-xl) 16px' }}>
      <Link to="/" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 'var(--space-lg)' }}>
        <Icon name="arrow-left" size={14} /> Back to Home
      </Link>

      <div style={{
        background: 'linear-gradient(135deg, var(--primary-light), #f0f4ff)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 'var(--radius-md)',
          background: 'var(--primary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
        }}>
          <CategoryIcon name={category.name} size={36} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 4 }}>{category.icon} {category.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>{category.description}</p>
        </div>
      </div>

      {details && (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Section title="Overview" content={details.overview} />

          {details.ayurveda && <Section title="Ayurvedic Significance" content={details.ayurveda} />}

          {details.benefits && (
            <Section title="Health Benefits">
              <ul style={{ lineHeight: 2.2, paddingLeft: 20, margin: 0 }}>
                {details.benefits.map((b, i) => <li key={i} style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{b}</li>)}
              </ul>
            </Section>
          )}

          {details.uses && (
            <Section title="Common Uses">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {details.uses.map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)', fontSize: '0.9375rem' }}>
                    <span style={{ color: 'var(--primary)' }}>✦</span> {u}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {details.types && (
            <Section title="Types">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                {details.types.map((t, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <strong style={{ fontSize: '0.9375rem', color: 'var(--primary)' }}>{t.name}</strong>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>{t.description}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {details.caution && (
            <div style={{
              padding: '16px 20px', background: '#fff8e6', border: '1px solid #f0d070',
              borderRadius: 'var(--radius-md)', marginTop: 'var(--space-xl)',
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#92500e', marginBottom: 4 }}>⚠️ Caution</div>
              <p style={{ fontSize: '0.875rem', color: '#6b4a0a', margin: 0 }}>{details.caution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 'var(--space-xl)' }}>
      <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid var(--primary-light)' }}>{title}</h2>
      {typeof children === 'string' ? (
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{children}</p>
      ) : children}
    </div>
  )
}
