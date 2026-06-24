import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import api from '../../api'
import Card from '../common/Card'
import Button from '../common/Button'
import StarRating from '../common/StarRating'
import Icon from '../../components/common/Icons'

export default function ProductCompare() {
  const { compareList, removeFromCompare } = useApp()
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.products()
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
  }, [])

  const compareProducts = useMemo(() => {
    return products.filter(p => compareList.includes(p.id))
  }, [compareList])

  if (compareProducts.length < 2) return null

  const allSpecKeys = useMemo(() => {
    const keys = new Set()
    compareProducts.forEach(p => {
      if (p.specs) Object.keys(p.specs).forEach(k => keys.add(k))
    })
    return Array.from(keys)
  }, [compareProducts])

  const highlightDiff = (key, values) => {
    const unique = new Set(values.filter(Boolean))
    return unique.size > 1
  }

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
      <div style={{ display: 'flex', gap: 0, minWidth: 600 }}>
        <div style={{ flex: '0 0 140px' }}>
          <div style={{ padding: '12px', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', height: 48, display: 'flex', alignItems: 'center' }}>
            Product
          </div>
          {allSpecKeys.map(key => (
            <div key={key} style={{
              padding: '10px 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              borderBottom: '1px solid var(--border-light)',
              background: 'var(--bg-gray)',
              height: 40,
              display: 'flex',
              alignItems: 'center',
            }}>
              {key}
            </div>
          ))}
        </div>

        {compareProducts.map(product => {
          const values = allSpecKeys.map(key => product.specs?.[key] || '—')
          return (
            <div key={product.id} style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                padding: '8px 12px',
                borderBottom: '1px solid var(--border)',
                borderLeft: '1px solid var(--border)',
                background: 'var(--primary-light)',
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, overflow: 'hidden' }}>{product.name}</span>
                <button
                  onClick={() => removeFromCompare(product.id)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 2, flexShrink: 0, display: 'flex' }}
                  title="Remove"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
              {values.map((val, vi) => {
                const isDiff = highlightDiff(allSpecKeys[vi], compareProducts.map(p => p.specs?.[allSpecKeys[vi]]))
                return (
                  <div key={vi} style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid var(--border-light)',
                    borderLeft: '1px solid var(--border)',
                    fontSize: '0.8125rem',
                    color: isDiff ? 'var(--primary)' : 'var(--text-primary)',
                    fontWeight: isDiff ? 600 : 400,
                    background: isDiff ? 'var(--primary-light)' : 'transparent',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {val}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
