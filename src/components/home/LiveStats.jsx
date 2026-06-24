import { useState, useEffect } from 'react'
import Icon from '../common/Icons'
import CountUp from '../common/CountUp'
import api from '../../api'

export default function LiveStats() {
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    Promise.all([
      api.vendors(),
      api.products()
    ]).then(([venRes, prodRes]) => {
      setVendors(venRes.data || [])
      setProducts(prodRes.data || [])
    }).catch(() => {
      setVendors([])
      setProducts([])
    })
  }, [])

  const statesCovered = [...new Set(vendors.map(v => v.state))].length
  const stats = [
    { label: 'Verified Vendors', target: vendors.length, icon: <Icon name="faIndustry" size={28} />, suffix: '+' },
    { label: 'Salt Varieties', target: products.length, icon: <Icon name="mdSalt" size={28} />, suffix: '+' },
    { label: 'States Covered', target: statesCovered, icon: <Icon name="globe" size={28} />, suffix: '' },
    { label: 'Delivered Today', target: 128, icon: <Icon name="truck" size={28} />, suffix: '+' },
  ]
  return (
    <section style={{ background: 'var(--bg-white)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: 'var(--border)',
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              background: 'var(--bg-white)',
              padding: '28px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}>
              {stat.icon}
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                <CountUp target={stat.target} suffix={stat.suffix} />
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section .container > div { grid-template-columns: repeat(2, 1fr) !important; }
          section .container > div div { padding: 20px 12px !important; }
          section .container > div span:first-of-type { font-size: 1.5rem !important; }
        }
        @media (max-width: 375px) {
          section .container > div div { padding: 16px 8px !important; }
          section .container > div span:first-of-type { font-size: 1.25rem !important; }
          section .container > div span:last-of-type { font-size: 0.75rem !important; }
        }
      `}</style>
    </section>
  )
}
