import { useState, useEffect } from 'react'
import api from '../../api'

const stateCoordinates = {
  'Maharashtra': { x: 52, y: 55 },
  'Rajasthan': { x: 45, y: 35 },
  'Gujarat': { x: 38, y: 48 },
  'Himachal Pradesh': { x: 50, y: 20 },
  'Tamil Nadu': { x: 60, y: 78 },
  'Punjab': { x: 48, y: 18 },
  'Uttarakhand': { x: 54, y: 22 },
  'Uttar Pradesh': { x: 58, y: 35 },
  'Kerala': { x: 55, y: 80 },
  'Goa': { x: 44, y: 60 },
  'West Bengal': { x: 70, y: 42 },
}

export default function VendorMap() {
  const [hovered, setHovered] = useState(null)
  const [showList, setShowList] = useState(false)
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    api.vendors()
      .then(res => setVendors(res.data || []))
      .catch(() => setVendors([]))
  }, [])

  const vendorLocations = vendors.filter(v => stateCoordinates[v.state])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          onClick={() => setShowList(!showList)}
          style={{
            padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: showList ? 'var(--primary-light)' : 'var(--bg-white)',
            cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, color: showList ? 'var(--primary)' : 'var(--text-secondary)',
            transition: 'all 0.2s',
          }}
        >
          {showList ? 'Show Map' : 'Show List'}
        </button>
      </div>

      {showList ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {vendorLocations.map(v => (
            <div key={v.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-white)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: v.banner,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: '#fff', fontSize: '0.75rem',
              }}>{v.logo}</div>
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block' }}>{v.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.city}, {v.state}</span>
              </div>
              <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--accent)', fontSize: '0.875rem' }}>★ {v.rating}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: 500,
          margin: '0 auto',
          aspectRatio: '0.8',
          background: 'var(--bg-gray)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <path
              d="M50 5 L55 8 L60 5 L65 10 L62 18 L70 22 L68 30 L75 35 L72 42 L78 48 L75 55 L70 52 L65 58 L60 55 L55 60 L50 58 L45 62 L40 58 L35 60 L30 55 L25 58 L22 50 L18 45 L22 38 L15 32 L20 25 L18 18 L25 12 L30 8 L35 12 L40 5 L45 8 Z"
              fill="var(--border-light)"
              stroke="var(--border-dark)"
              strokeWidth="0.3"
            />
            {vendorLocations.map(v => {
              const pos = stateCoordinates[v.state]
              if (!pos) return null
              const isHovered = hovered === v.id
              return (
                <g key={v.id}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 4 : 2.5}
                    fill={v.banner}
                    stroke="#fff"
                    strokeWidth="0.5"
                    style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                    onMouseEnter={() => setHovered(v.id)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  {isHovered && (
                    <g>
                      <rect
                        x={pos.x - 20}
                        y={pos.y - 14}
                        width={40}
                        height={12}
                        rx={2}
                        fill="var(--bg-white)"
                        stroke="var(--border)"
                        strokeWidth="0.3"
                      />
                      <text x={pos.x} y={pos.y - 6} textAnchor="middle" fontSize="2.5" fontWeight="600" fill="var(--text-primary)">
                        {v.name}
                      </text>
                      <text x={pos.x} y={pos.y - 2} textAnchor="middle" fontSize="2" fill="var(--accent)">
                        ★ {v.rating}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
          <div style={{
            position: 'absolute', bottom: 12, left: 12, right: 12,
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)', padding: '8px 12px',
            border: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {vendorLocations.length} vendors across {new Set(vendorLocations.map(v => v.state)).size} states
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
