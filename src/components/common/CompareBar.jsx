import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import api from '../../api'
import Icon from './Icons'

export default function CompareBar() {
  const { compareList, removeFromCompare } = useApp()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.products()
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
  }, [])

  if (compareList.length < 2) return null

  const compareProducts = products.filter(p => compareList.includes(p.id))

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 900,
      background: 'var(--bg-white)', borderTop: '2px solid var(--primary)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', padding: '12px 16px',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Compare ({compareList.length})
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {compareProducts.map(p => (
              <span key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--primary-light)', borderRadius: 'var(--radius-full)',
                padding: '4px 8px 4px 12px', fontSize: '0.8125rem', fontWeight: 500,
              }}>
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                <button
                  onClick={() => removeFromCompare(p.id)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex', lineHeight: 0, flexShrink: 0 }}
                  title="Remove"
                >
                  <Icon name="close" size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => compareList.forEach(id => removeFromCompare(id))}>
            Clear All
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/compare?ids=${compareList.join(',')}`)}>
            Compare
          </button>
        </div>
      </div>
    </div>
  )
}
